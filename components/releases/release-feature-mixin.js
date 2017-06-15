import {createReleaseBaseDetailsQuery} from './queries'
import client from '../../plugins/apollo'

export const ReleaseFeature = {
  data: function () {
    return {
      release: null
    }
  },
  async asyncData ({app, params}) {
    var {data} = await app.apollo.query(createReleaseBaseDetailsQuery(params.slug))
    return {
      release: data.release
    }
  }
}
