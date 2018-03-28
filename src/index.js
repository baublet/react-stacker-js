import StackRenderer from "./StackRenderer"
import RenderInStack from "./RenderInStack"

export const DEFAULT_INSTANCE_ID = "react-stacker/default-instance-id",
             globalContext = {}
      
const ReactStacker = {
        DEFAULT_INSTANCE_ID,
        globalContext,
        StackRenderer,
        RenderInStack
      }

export default ReactStacker
export { StackRenderer, RenderInStack }