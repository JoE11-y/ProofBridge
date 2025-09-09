use dep::ecrecover;

fn main(
    ad_creator_x: [u8; 32],
    ad_creator_y: [u8; 32],
    ad_creator_sig: [u8; 64],
    bridger_x: [u8; 32],
    bridger_y: [u8; 32],
    bridger_sig: [u8; 64],
    ad_creator: pub Field,
    bridger: pub Field,
    msg_hash: pub [u8; 32],
) {
    // Verify ad_creator signature
    let expected_ad_creator =
        ecrecover::ecrecover(ad_creator_x, ad_creator_y, ad_creator_sig, msg_hash);
    assert_eq(ad_creator, expected_ad_creator);

    // Verify bridger signature
    let expected_bridger = ecrecover::ecrecover(bridger_x, bridger_y, bridger_sig, msg_hash);
    assert_eq(bridger, expected_bridger);
}
