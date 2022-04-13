import view from "./view";

function renderer(scatfold: any, resources: { [key: string]: string } = {}) {
  const { routes } = scatfold;

  const views: any = {};
  (routes || []).forEach((route: any) => {
    const html = view.render(scatfold.views[route.view], resources);

    if (!!html.body.length) {
      views[route.view] = html;
    }
  });

  return { routes, views };
}

export default renderer;
