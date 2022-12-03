export class Action {
  constructor(
    public Id: string,
    public Timestamp: Date,
    public Email: string,
    public Calling: string,
    public UserName: string,
    public MinisterName: string,
    public Details: string | null,
  ) { }
}