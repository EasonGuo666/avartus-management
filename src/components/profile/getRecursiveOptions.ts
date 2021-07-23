
function getRecursiveOptions(list: any, disabledList: any) {
  let res: any = []
  for (var item of list) {
    res.push({ value: item["Node.uuid"], label: item["Profile.label"], disabled: disabledList.indexOf(item["Node.uuid"]) !== -1 })
  }
  return res;
}

export { getRecursiveOptions }
