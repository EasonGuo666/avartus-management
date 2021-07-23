import { getAuth } from "../selectors"
import { useSelector } from "react-redux";

export const HiddenByTrustLevel = (): boolean => {
  const { user } = useSelector(getAuth)
  if (user === null) {
    return false
  }
  return user.trust_level? ( user.trust_level === null? false: ( user.trust_level < 6 && user.trust_level >= 0)) : false;
}
