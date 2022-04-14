import parse from "./parse";
import storage from "./storage";

function property(name: string, content: string) {
  const regex = /\{(?<key>.+)\}/;
  const matched = name.match(regex);

  if (matched) {
    const { key } = matched.groups as any;
    return key ? { [key]: content } : {};
  }
  return {};
}

function getProperties(children: any) {
  const properties = children
    .map((v: any) => property(v.name, v.characters))
    .reduce((a: any, b: any) => ({ ...a, ...b }), {});
  return properties;
}

function node(item: any) {
  const components = storage.getItem("components");
  const { name, id, children = [], type = "", characters, componentId } = item;
  const tag = /^Rectangle/g.test(name) ? "div" : name;
  const element = parse.selector(tag);

  let childNode = [];

  //* Property from children
  let props =
    ["INSTANCE"].indexOf(type.toUpperCase()) > -1
      ? getProperties(children)
      : {};

  //* exist component
  let pairs = !!componentId ? parse.pair(components[componentId].name) : {};

  //* merge all
  element.attributes = { ...element.attributes, ...props, ...pairs };
  childNode = children.map(node).filter(Boolean);

  return /\{(.+)\}/.test(name)
    ? null
    : {
        key: id,
        ...element,
        children: childNode,
        ...(characters ? { textContent: characters } : {}),
      };
}

export default node;
