import { Animation, Component, Material, Mesh, Object3D } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";

export class ActiveOnState extends Component {
  static TypeName = "active-on-state";

  /*
   * The state that this component should be active on.
   */
  @property.string('')
  state = '';
  /**
   * whether child object's components should be affected
   */
  @property.bool(true)
  affectChildren = true;

  @property.bool(false)
  inactive = false;

  init() {}

  start() {}

  update(dt: number) {}
}
