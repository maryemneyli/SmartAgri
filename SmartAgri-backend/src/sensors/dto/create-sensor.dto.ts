export class CreateSensorDto {
  readonly _id: string;
  readonly bd: string;
  readonly name: string;
  readonly type: string;
  readonly location: string;
  readonly status: boolean;
  readonly userId: string;
}