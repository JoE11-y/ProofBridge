use poseidon::poseidon2;

fn u32_shl(base: u32, amt: u32) -> u32 {
    let shift_amt: u8 = amt as u8;
    base << shift_amt
}

// ----------------------------------------------------
// Public verifier entrypoint
// ----------------------------------------------------

pub fn verify_proof(
    index: Field, // global MMR node index (1-indexed)
    value_hash: Field, // Poseidon2-field-modded leaf hash (what TS calls `valueHash` AFTER fieldMod)
    sibling_hashes_len: Field, // siblings.length
    sibling_hashes: [Field; 20], // siblings bottom -> up
    peaks_hashes_len: Field, // peaks.length
    peak_hashes: [Field; 20], // peak hashes, same order as getPeakIndexes(width)
    tree_width: Field, // width
    root: Field, // claimed MMR root
) -> bool {
    let width: u32 = tree_width as u32;
    let idx: u32 = index as u32;
    let sib_len: u32 = sibling_hashes_len as u32;
    let peaks_len: u32 = peaks_hashes_len as u32;

    // sanity checks
    assert(width > 0u32);
    assert(sib_len <= 20u32);
    assert(peaks_len <= 20u32);

    // size must match getSize(width)
    let size_calc: u32 = get_size(width);

    // index must be within range
    assert(idx <= size_calc);

    // recompute root from peaks
    let computed_root: Field = peak_bagging(width, peak_hashes, peaks_len);

    // require provided `root` matches computed root
    assert(computed_root == root);

    // recompute peak indexes
    let (peak_indexes, num_peaks): ([u32; 32], u32) = get_peak_indexes(width);

    // must line up with caller's provided peak list length
    assert(num_peaks == peaks_len);

    // get first peak index >= idx
    let (chosen_peak_index, chosen_peak_hash) =
        choose_peak(idx, peak_indexes, num_peaks, peak_hashes);

    // safety: must have found a real peak
    assert(chosen_peak_index != 0u32);

    // build downward path from chosen_peak_index to idx
    let path: [u32; 21] = build_path_to_index(chosen_peak_index, idx, sib_len);

    let reconstructed_peak: Field =
        reconstruct_peak(path, sib_len, idx, value_hash, sibling_hashes);

    // final check: reconstructed peak must match chosen peak hash
    assert(reconstructed_peak == chosen_peak_hash);

    true
}

// ----------------------------------------------------
// Core helpers
// ----------------------------------------------------

// getSize(width) = (width << 1) - popcount(width)
fn get_size(width: u32) -> u32 {
    let num_peaks = count_set_bits(width);
    let two: u32 = 1u32 + 1u32;
    (width * two) - num_peaks
}

// count set bits (Kernighan)
fn count_set_bits(mut n: u32) -> u32 {
    let mut count = 0u32;

    for _i in 0..32 {
        let not_zero: bool = n != 0u32;
        let not_zero_u32: u32 = if not_zero { 1u32 } else { 0u32 };

        let n_minus_1 = if n > 0u32 { n - 1u32 } else { 0u32 };
        let kern = n & n_minus_1;
        n = n * (1u32 - not_zero_u32) + kern * not_zero_u32;

        count = count + not_zero_u32;
    }

    count
}

fn get_peak_indexes(width: u32) -> ([u32; 32], u32) {
    // n = popcount(width)
    let n = count_set_bits(width);

    let mut result: [u32; 32] = [0u32; 32];
    let mut count = 0u32;
    let mut accum_size = 0u32;

    // compute maxH
    let mut max_h = 1u32;
    for i in 1..32 {
        // if (1<<i) <= width
        let one_shift_i: u32 = u32_shl(1u32, i);
        let cond: bool = one_shift_i <= width;
        let cond_u32: u32 = if cond { 1u32 } else { 0u32 };

        let candidate = i + 1u32;
        max_h = max_h * (1u32 - cond_u32) + candidate * cond_u32;
    }

    // emulate "for (h = maxH; h > 0; h--)" in a fixed loop
    // We'll iterate offset 0..32 and map to height = max_h - offset
    for off in 0..32 {
        let valid_off: bool = off < max_h;
        let valid_off_u32: u32 = if valid_off { 1u32 } else { 0u32 };

        // Guard against underflow when off >= max_h
        let height_val = if max_h >= off { max_h - off } else { 0u32 }; // (h)
        let height_gt0: bool = height_val > 0u32;
        let height_gt0_u32: u32 = if height_gt0 { 1u32 } else { 0u32 };

        // mask = 1 << (h-1)
        // Guard against underflow when height_val = 0
        let hm1 = if height_val > 0u32 {
            height_val - 1u32
        } else {
            0u32
        };
        let mask: u32 = u32_shl(1u32, hm1);

        let bit_set: bool = (width & mask) != 0u32;
        let bit_set_u32: u32 = if bit_set { 1u32 } else { 0u32 };

        // subtree_nodes = (1<<h) - 1
        let one_shift_h = u32_shl(1u32, height_val);

        // Guard against underflow when one_shift_h = 0 or 1
        let subtree_nodes = if one_shift_h > 0u32 {
            one_shift_h - 1u32
        } else {
            0u32
        };

        // condition: valid_off && height_gt0 && bit_set
        let do_add_u32: u32 = valid_off_u32 * height_gt0_u32 * bit_set_u32;

        // accum_size += subtree_nodes when do_add_u32 == 1
        accum_size = accum_size + subtree_nodes * do_add_u32;

        // write accum_size into result[count] if do_add_u32 == 1
        let mut new_result: [u32; 32] = result;
        for k in 0..32 {
            let match_slot: bool = k == count;
            let match_slot_u32: u32 = if match_slot { 1u32 } else { 0u32 };

            let do_write_u32: u32 = do_add_u32 * match_slot_u32;

            // new_result[k] = do_write ? accum_size : old
            new_result[k] = new_result[k] * (1u32 - do_write_u32) + accum_size * do_write_u32;
        }
        result = new_result;

        // count++
        count = count + do_add_u32;
    }

    (result, n)
}

fn peak_bagging(width: u32, peaks: [Field; 20], peaks_len: u32) -> Field {
    // special empty case
    let empty_case: bool = (width == 0u32) & (peaks_len == 0u32);
    let empty_case_f: Field = if empty_case { 1 } else { 0 };

    let size_val: u32 = get_size(width);

    // acc starts as size (as a Field)
    let mut acc: Field = size_val as Field;

    // we also assert #peaks matches popcount(width), same as TS does logically
    let expected_len: u32 = count_set_bits(width);
    assert(expected_len == peaks_len);

    // fold peaks
    for i in 0..20 {
        let use_this: bool = i < peaks_len;
        let use_this_f: Field = if use_this { 1 } else { 0 };

        let hashed = poseidon2::Poseidon2::hash([acc, peaks[i]], 2);

        // acc = use_this ? hashed : acc
        acc = acc * (1 - use_this_f) + hashed * use_this_f;
    }

    // final outer bind with size
    let final_hash = poseidon2::Poseidon2::hash([size_val as Field, acc], 2);

    // if (width==0 && peaks_len==0) => 0, else final_hash
    let zero_val: Field = 0;
    let out_val: Field = zero_val * empty_case_f + final_hash * (1 - empty_case_f);

    out_val
}

fn choose_peak(
    idx: u32,
    peak_indexes: [u32; 32],
    num_peaks: u32,
    peak_hashes: [Field; 20],
) -> (u32, Field) {
    let mut taken_flag: u32 = 0u32;

    let mut chosen_idx: u32 = 0u32;
    let mut chosen_hash: Field = 0;

    // Iterate through all possible peaks (bounded 32)
    for i in 0..32 {
        if (i < num_peaks) {
            // is this index even valid? i < num_peaks
            let valid_peak: bool = i < num_peaks;
            let valid_peak_u32: u32 = if valid_peak { 1u32 } else { 0u32 };
            let valid_peak_f: Field = if valid_peak { 1 } else { 0 };

            // read candidate peak index
            let pi: u32 = peak_indexes[i];

            // cond: this peak covers idx?
            let covers: bool = pi >= idx;
            let covers_u32: u32 = if covers { 1u32 } else { 0u32 };

            // cond: we have NOT taken yet?
            // taken_flag == 0 => not yet taken
            let not_taken_u32: u32 = 1u32 - taken_flag;

            // need_u32 = valid_peak && covers && (taken_flag==0)
            // (AND is multiplication because we're in 0/1 u32 land)
            let need_u32: u32 = valid_peak_u32 * covers_u32 * not_taken_u32;

            // Blend chosen_idx:
            // if need_u32==1 -> choose pi
            // else keep previous
            chosen_idx = chosen_idx * (1u32 - need_u32) + pi * need_u32;

            // chosen_hash:
            // grab peak_hashes[i] only if valid_peak, otherwise fall back to old chosen_hash
            let cur_peak_hash_raw: Field = peak_hashes[i];
            let cur_peak_hash: Field =
                cur_peak_hash_raw * valid_peak_f + chosen_hash * (1 - valid_peak_f);

            chosen_hash =
                chosen_hash * (1 - (need_u32 as Field)) + cur_peak_hash * (need_u32 as Field);

            // Update taken_flag:
            // if we just used this one (need_u32==1) set taken_flag=1, else keep whatever it was
            taken_flag = taken_flag * (1u32 - need_u32) + 1u32 * need_u32;
        }
    }

    (chosen_idx, chosen_hash)
}

fn build_path_to_index(start_cursor: u32, leaf_index: u32, siblings_len: u32) -> [u32; 21] {
    let mut path: [u32; 21] = [0u32; 21];

    // h = siblings_len + 1
    let mut h_val: u32 = siblings_len + 1u32;
    let mut cursor: u32 = start_cursor;
    let mut done: bool = false;

    for _step in 0..21 {
        // body only runs if h_val > 0
        let h_gt0: bool = h_val > 0u32;
        let h_gt0_u32: u32 = if h_gt0 { 1u32 } else { 0u32 };

        // pre-decrement h
        // Guard against underflow when h_val = 0
        let decremented: u32 = if h_val > 0u32 { h_val - 1u32 } else { 0u32 };
        h_val = h_val * (1u32 - h_gt0_u32) + decremented * h_gt0_u32;

        // write path[h_val] = cursor if body active
        let mut new_path = path;
        for slot in 0..21 {
            let slot_match: bool = (slot as u32) == h_val;
            let slot_match_u32: u32 = if slot_match { 1u32 } else { 0u32 };
            let do_write_u32: u32 = slot_match_u32 * h_gt0_u32;

            new_path[slot] = new_path[slot] * (1u32 - do_write_u32) + cursor * do_write_u32;
        }
        path = new_path;

        // hit leaf?
        let hit_leaf: bool = cursor == leaf_index;
        let updated_done_if_body: bool = if h_gt0 {
            (if hit_leaf { true } else { done })
        } else {
            done
        };
        done = updated_done_if_body;

        // descend unless done
        let (left_c, right_c) = get_children(cursor);
        let go_left: bool = leaf_index <= left_c;
        let next_cursor = if go_left { left_c } else { right_c };

        // update cursor only if h_gt0 && !done
        let not_done: bool = !done;
        let upd_ok: bool = h_gt0 & not_done;
        let upd_ok_u32: u32 = if upd_ok { 1u32 } else { 0u32 };

        cursor = cursor * (1u32 - upd_ok_u32) + next_cursor * upd_ok_u32;
    }

    path
}

fn get_children(node_index: u32) -> (u32, u32) {
    let h: u32 = height_at(node_index);

    // Guard against underflow when h = 0 (should not happen in valid MMR)
    let hm1: u32 = if h > 0u32 { h - 1u32 } else { 0u32 };
    let offset: u32 = u32_shl(1u32, hm1);

    let left: u32 = node_index - offset;
    let right: u32 = node_index - 1u32;

    // TS throws if left===right (not a parent). We skip that check here.
    (left, right)
}

fn height_at(index: u32) -> u32 {
    let mut reduced = index;
    let mut peak_idx = 0u32;
    let mut h_val = 0u32;

    for _i in 0..32 {
        let cond: bool = reduced > peak_idx;
        let cond_u32: u32 = if cond { 1u32 } else { 0u32 };

        // subtract_amt = (h_val>0) ? (1<<h_val)-1 : 0
        let h_gt0: bool = h_val > 0u32;
        let h_gt0_u32: u32 = if h_gt0 { 1u32 } else { 0u32 };

        let one_shift_h = u32_shl(1u32, h_val);
        // Guard against underflow when one_shift_h = 0
        let sub_amt_base = if one_shift_h > 0u32 {
            one_shift_h - 1u32
        } else {
            0u32
        };
        let sub_amt = sub_amt_base * h_gt0_u32;

        // Guard against underflow when reduced < sub_amt
        let reduced_new = if reduced >= sub_amt {
            reduced - sub_amt
        } else {
            0u32
        };
        reduced = reduced * (1u32 - cond_u32) + reduced_new * cond_u32;

        // new h_val = mountain_height(reduced_new)
        let mh = mountain_height(reduced_new);
        h_val = h_val * (1u32 - cond_u32) + mh * cond_u32;

        // new peak_idx = (1<<h_val) - 1
        let one_shift_hv = u32_shl(1u32, h_val);
        // Guard against underflow when one_shift_hv = 0
        let peak_idx_new = if one_shift_hv > 0u32 {
            one_shift_hv - 1u32
        } else {
            0u32
        };
        peak_idx = peak_idx * (1u32 - cond_u32) + peak_idx_new * cond_u32;
    }

    // slope correction:
    // h_val - (peak_idx - reduced) if peak_idx >= reduced else h_val
    let cond2: bool = peak_idx >= reduced;
    let cond2_u32: u32 = if cond2 { 1u32 } else { 0u32 };

    // Guard against underflow in diff and corrected
    let diff = if peak_idx >= reduced {
        peak_idx - reduced
    } else {
        0u32
    };
    let corrected = if h_val >= diff { h_val - diff } else { 0u32 };

    let out_h = h_val * (1u32 - cond2_u32) + corrected * cond2_u32;
    out_h
}

fn mountain_height(size: u32) -> u32 {
    let mut h_val = 1u32;

    for i in 1..32 {
        // if (1<<i) <= size + i:
        let lhs = u32_shl(1u32, i);
        let rhs = size + i;
        let ok: bool = lhs <= rhs;
        let ok_u32: u32 = if ok { 1u32 } else { 0u32 };

        let candidate = i + 1u32;
        h_val = h_val * (1u32 - ok_u32) + candidate * ok_u32;
    }

    // return h_val - 1 if h_val>0 else h_val
    let h_gt0: bool = h_val > 0u32;
    let h_gt0_u32: u32 = if h_gt0 { 1u32 } else { 0u32 };
    // Guard against underflow when h_val = 0
    let minus1 = if h_val > 0u32 { h_val - 1u32 } else { 0u32 };
    let res = h_val * (1u32 - h_gt0_u32) + minus1 * h_gt0_u32;
    res
}
fn reconstruct_peak(
    path: [u32; 21],
    siblings_len: u32,
    leaf_index: u32,
    value_hash: Field,
    siblings: [Field; 20],
) -> Field {
    // 1. find leaf_pos = index of leaf_index in path
    let mut leaf_pos: u32 = 0u32;
    let mut already_found: bool = false;

    for i in 0..21 {
        let match_leaf: bool = path[i] == leaf_index;
        let take_it: bool = match_leaf & (!already_found);
        let take_it_u32: u32 = if take_it { 1u32 } else { 0u32 };

        leaf_pos = leaf_pos * (1u32 - take_it_u32) + (i as u32) * take_it_u32;

        // once we've picked first match, lock it
        let new_found: bool = if take_it { true } else { already_found };
        already_found = new_found;
    }

    // 2. node = hashLeaf(leaf_index, value_hash)
    let mut node: Field = hash_leaf(leaf_index, value_hash);

    // 3. climb steps 1..siblings_len, mixing in siblings
    for step in 1..21 {
        let step_u32: u32 = step as u32;

        // only meaningful if step_u32 <= siblings_len
        let active: bool = step_u32 <= siblings_len;
        let active_f: Field = if active { 1 } else { 0 };

        // cur_pos = leaf_pos + step_u32
        let cur_pos: u32 = leaf_pos + step_u32;

        // parent_idx = path[cur_pos] via selector-scan
        let mut parent_idx: u32 = 0u32;
        for k in 0..21 {
            let match_slot: bool = (k as u32) == cur_pos;
            let match_slot_u32: u32 = if match_slot { 1u32 } else { 0u32 };
            parent_idx = parent_idx + path[k] * match_slot_u32;
        }

        // prev_idx = path[cur_pos - 1]
        // Guard against underflow when cur_pos = 0
        let prev_pos: u32 = if cur_pos > 0u32 { cur_pos - 1u32 } else { 0u32 };
        let mut prev_idx: u32 = 0u32;
        for k in 0..21 {
            let match_prev: bool = (k as u32) == prev_pos;
            let match_prev_u32: u32 = if match_prev { 1u32 } else { 0u32 };
            prev_idx = prev_idx + path[k] * match_prev_u32;
        }

        // sibling index = step_u32 - 1
        // Guard against underflow when step_u32 = 0 (should not happen, loop starts at 1)
        let sib_i: u32 = if step_u32 > 0u32 {
            step_u32 - 1u32
        } else {
            0u32
        };
        let mut sib_val: Field = 0;
        for j in 0..20 {
            let match_sib: bool = (j as u32) == sib_i;
            let match_sib_f: Field = if match_sib { 1 } else { 0 };
            sib_val = sib_val * (1 - match_sib_f) + siblings[j] * match_sib_f;
        }

        // prev_was_right = (parent_idx - 1 == prev_idx)
        // Guard against underflow when parent_idx = 0 (padding)
        let parent_minus_1 = if parent_idx > 0u32 {
            parent_idx - 1u32
        } else {
            0u32
        };
        let prev_was_right: bool = parent_minus_1 == prev_idx;
        let prev_was_right_f: Field = if prev_was_right { 1 } else { 0 };
        let not_right_f: Field = 1 - prev_was_right_f;

        // candidate_right = hash_branch(parent_idx, sib_val, node)
        let candidate_right: Field = hash_branch(parent_idx, sib_val, node);

        // candidate_left  = hash_branch(parent_idx, node, sib_val)
        let candidate_left: Field = hash_branch(parent_idx, node, sib_val);

        let merged_node: Field = candidate_right * prev_was_right_f + candidate_left * not_right_f;

        // node = active ? merged_node : node
        node = node * (1 - active_f) + merged_node * active_f;

        // If parent_idx == 0 (means path slot was empty padding), don't update.
        let parent_zero: bool = parent_idx == 0u32;
        let parent_zero_f: Field = if parent_zero { 1 } else { 0 };
        node = node * (1 - parent_zero_f) + node * parent_zero_f * 1;
        // (the last line is effectively no-op but keeps constraints well-formed)
    }

    node
}

fn hash_leaf(index_val: u32, data_hash: Field) -> Field {
    poseidon2::Poseidon2::hash([index_val as Field, data_hash], 2)
}

fn hash_branch(parent_index: u32, left: Field, right: Field) -> Field {
    poseidon2::Poseidon2::hash([parent_index as Field, left, right], 3)
}
