import * as R from "ramda";
import node from "./node";
export default (document: any) => {
  let views = {} as { [key: string]: any };

  const routes = R.pipe(
    R.reject((v: any) => !!/^\@/.test(v.name)),
    R.head,
    (v: any) =>
      (v.children || []).map((v: any) => {
        const { name, id, children } = v;
        views[id] = children.map(node);
        return { path: name, view: id };
      })
  )(document.children);

  return { routes, views };
};
