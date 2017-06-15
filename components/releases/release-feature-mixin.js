import {createReleaseBaseDetailsQuery} from './queries'
import client from '../../plugins/apollo'

export const ReleaseFeature = {
  data: function () {
    return {
      release: null
    }
  },
  async asyncData ({params}) {
    var {data} = await client.query(createReleaseBaseDetailsQuery(params.slug))
    return {
      release: data.release
    }
  }
}
