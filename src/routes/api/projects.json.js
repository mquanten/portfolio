export const get = async () => {
  const allProjectFiles = import.meta.glob('../projects/*.md')
  const iterableProjectFiles = Object.entries(allProjectFiles)

  const allProjects = await Promise.all(
    iterableProjectFiles.map(async ([path, resolver]) => {
      const { metadata } = await resolver()
      const projectPath = path.slice(2, -3)

      return {
        meta: metadata,
        path: projectPath
      }
    })
  )

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(a.meta.date) - new Date(b.meta.date)
  })

  return {
    body: sortedProjects
  }
}
