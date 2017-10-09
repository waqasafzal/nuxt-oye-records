export default function ({route, redirect}) {
  if (route.name === 'info') {
    return redirect('/info/questions')
  }
}
