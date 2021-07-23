import { useDispatch } from "react-redux"
import { store } from "../utils"
import rootReducer from '../slices'
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export type RootState = ReturnType<typeof rootReducer>;


// dispatch的typescript用法
export type AppDispatch = typeof store.dispatch
// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 定义html event type
// export type ReactMouseEvent =
//   | MouseEvent
//   | React.MouseEvent<HTMLDivElement>
//   | React.ChangeEvent<HTMLSelectElement>
//   | DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,HTMLInputElement> 

export type ReactSubmitEvent = React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>

//定义event类型interface
export interface ITextEventTarget extends EventTarget {
  name: string;
  value: string
}
export interface ReactMouseEvent extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  target: ITextEventTarget;
}
