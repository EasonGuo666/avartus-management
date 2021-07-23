
function getActionOptions(list: any, disabledList: any) {
  let res: any = []
  for (var item of list) {
    let locationFlag = false
    for (var location of res) {
      if (location["value"] === item["locationValue"]) {// location already exist in the options
        locationFlag = true
        let deviceFlag = false
        for (var device of location["children"]) {
          if (device["value"] === item["deviceValue"]) {// device already exist in the location
            deviceFlag = true
            device["children"].push({ value: item["actionValue"], label: item["actionLabel"], disabled: disabledList.indexOf(item["actionValue"]) !== -1 })
            break
          }
        }
        if (!deviceFlag) {
          location["children"].push({
            value: item["deviceValue"], label: item["deviceLabel"],
            children: [{ value: item["actionValue"], label: item["actionLabel"], disabled: disabledList.indexOf(item["actionValue"]) !== -1 },],
          })
        }
      }
    }
    if (!locationFlag) {
      res.push({
        value: item["locationValue"], label: item["locationLabel"],
        children: [{
          value: item["deviceValue"], label: item["deviceLabel"],
          children: [{ value: item["actionValue"], label: item["actionLabel"], disabled: disabledList.indexOf(item["actionValue"]) !== -1 },],
        }]
      })
    }
  }
  return res;
}

export { getActionOptions }
