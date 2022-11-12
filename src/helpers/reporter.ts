/**
 * This is a Custom reporter for Jasmine to be able to display jasmine results to the terminal.
 * This is inspired from https://github.com/bcaudan/jasmine-spec-reporter/tree/master/examples/typescript
 */
 import {
    DisplayProcessor,
    SpecReporter,
    StacktraceOption,
  } from "jasmine-spec-reporter";
  import SuiteInfo = jasmine.SuiteInfo;
  
  // Custom log processor
  class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
      return `Jasmie: ${log}`;
    }
  }
  
  // Clear any reporters
  jasmine.getEnv().clearReporters();
  // Add the custom reporter to Jasmine
  jasmine.getEnv().addReporter(
    new SpecReporter({
        suite: {
            displayNumber: true
        },
        spec: {
            displayStacktrace: StacktraceOption.NONE
        },
        customProcessors: [
            CustomProcessor // set our custom reporter
        ]
    })
);
