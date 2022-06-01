export const get = async () => {
  const allAbrasionFiles = import.meta.glob('../projects/abrasion/*.md')
  const iterableAbrasionFiles = Object.entries(allAbrasionFiles)

  const allAbrasions = await Promise.all(
    iterableAbrasionFiles.map(async ([path, resolver]) => {
      const { metadata } = await resolver()
      const AbrasionPath = path.slice(2, -3)

      return {
        meta: metadata,
        path: AbrasionPath
      }
    })
  )

  return {
    body: allAbrasions
  }
}
