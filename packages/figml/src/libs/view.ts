import * as R from "ramda";

const dataset = (record: any = {}) => {
  return Object.entries(record).reduce((a, b) => {
    const [key, value] = b;
    return `${a} data-${key}="${value}"`;
  }, "");
};

const className = (list: string[] = []) => {
  return list.length ? ` class="${list.join(".")}"` : "";
};

const script = (asset = []) => {
  return asset.reduce((a, b) => {
    return `${a}<script type="text/javascript" src="${b}"></script>`;
  }, "");
};

const stylesheet = (asset = []) => {
  return asset.reduce((a, b) => {
    return `${a}<link rel="stylesheet" href="${b}" />`;
  }, "");
};

const render = (scheme: any, resources: any) => {
  let dom = R.pipe(
    R.filter((v: any) => !!v.tagName),
    R.reduce(
      (a, b) => {
        const { tagName, classList = "", attributes = {}, children = [] } = b;

        let head = a.head;
        if (resources[tagName]) {
          head = `${head}${stylesheet(resources[tagName].stylesheet)}${script(
            resources[tagName].script
          )}`;
        }

        const body = `${a.body}<${tagName}${className(classList)}${dataset(
          attributes
        )}>${children.map(render)}</${tagName}>`;
        return { head, body };
      },
      { head: "", body: "" }
    )
  )(scheme);

  return dom;
};
export default { render };
