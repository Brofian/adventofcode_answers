"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRiddle_1 = __importDefault(require("../../src/JS/AbstractRiddle"));
class Y2023_Day07_2 extends AbstractRiddle_1.default {
    constructor() {
        super(...arguments);
        this.riddle = "Test";
    }
    run() {
        return 42;
    }
}
exports.default = (new Y2023_Day07_2());
