#!/usr/bin/env node

import * as fs from "fs-extra";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { program } from "commander";
import renderer from "./libs/renderer";

program.option("-c, --config <path>", "Configuration file path");
program.option("-f, --figon <path>", "Figon json file path");
program.option("-o, --output <path>", "Output directory path");
program.parse();

let setup: any = {
  config: null,
  figon: null,
};

const args = program.opts();
setup.output = args.output || "figml/pages";

const configuration = path.resolve(process.cwd(), "figml.config.json");
if (fs.existsSync(configuration)) {
  try {
    setup.config = JSON.parse(
      fs
        .readFileSync(path.resolve(process.cwd(), configuration))
        .toString("utf8")
    );
  } catch (e) {}
}

const figon = path.resolve(process.cwd(), "figon.json");
if (fs.existsSync(figon)) {
  try {
    setup.figon = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), figon)).toString("utf8")
    );
  } catch (e) {}
}

if (args.config) {
  try {
    setup.config = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), args.config)).toString("utf8")
    );
  } catch (e) {
    throw e;
  }
}

if (args.figon) {
  try {
    setup.figon = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), args.figon)).toString("utf8")
    );
  } catch (e) {
    throw e;
  }
}

function start(source: any, config: any = {}) {
  const { routes, views } = renderer(
    source,
    (config["resources"] || {}) as any
  );

  (routes || []).forEach((route: any) => {
    const dist = path.resolve(
      process.cwd(),
      `${setup.output}/${route.path}`.replace(/\/\//g, "/")
    );

    const content = views[route.view];

    if (content) {
      const { head, body } = content;
      const html = `<html><head>${head}</head><body>${body}</body></html>`;

      mkdirp.sync(dist);
      fs.writeFileSync(`${dist}/index.html`, html);
    }
  });
}

if (setup.figon) {
  start(setup.figon, setup.config || {});
} else {
  throw new Error("Not found figon file");
}
