#!/usr/bin/env node
import { run } from "../lib/cli-main.mjs";

process.exitCode = run(process.argv.slice(2));
