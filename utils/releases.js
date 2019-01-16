
export const getReleases = (releaseGroups) => {
  return releaseGroups
    .filter(group => group && group.edges.length > 0)
    .map(group => group.edges.map(edge => edge.node))
    .reduce((acc, releases) => [...acc, ...releases], [])
}