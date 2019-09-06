import { filter, mapTo, delay } from "rxjs/operators";
import { of, pipe } from "rxjs";
import Observable from "redux-observable";

const pingEpic = (action$: any) => action$.pipe(
  filter((action: any) => action.type === 'PING'),
  delay(1000),
  mapTo({ type: 'PONG' })
);

const obs = of({ data: "string" });