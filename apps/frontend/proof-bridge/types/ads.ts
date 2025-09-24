export interface ICreateAdRequest {
  routeId: string
  creatorDstAddress: string
  metadata: {
    title: string
    description: string
  }
}
