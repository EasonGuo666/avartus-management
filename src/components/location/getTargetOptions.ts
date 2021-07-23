
function getTargetOptions(list: any, currentTarget: string) {
  let res: any = []
  for (var item of list) {
    let locationFlag = false
    for (var location of res) {
      if (location["value"] === item["locationValue"]) {// location already exist in the options
        locationFlag = true
        location["children"].push({
          value: item["deviceValue"], label: item["deviceLabel"], disabled: item["deviceValue"] === currentTarget
        })
      }
    }
    if (!locationFlag) {
      res.push({
        value: item["locationValue"], label: item["locationLabel"],
        children: [{
          value: item["deviceValue"], label: item["deviceLabel"], disabled: item["deviceValue"] === currentTarget
        }]
      })
    }
  }
  return res;
}

export { getTargetOptions }
