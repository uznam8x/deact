import parse from "./parse";
import storage from "./storage";
function node(item: any) {
  const components = storage.getItem("components");
  const { name, children = [], type = "", characters, componentId } = item;

  let childNode = [];
  if (["INSTANCE", "COMPONENT"].indexOf(type.toUpperCase()) > -1) {
  } else {
    childNode = children.map(node);
  }

  const spec = parse.selector(name);
  if (!!componentId) {
    spec.attributes = {
      ...spec.attributes,
      ...parse.pair(components[componentId].name),
    };
  }

  return {
    ...spec,
    children: childNode,
    ...(characters ? { textContent: characters } : {}),
  };
}

export default node;
