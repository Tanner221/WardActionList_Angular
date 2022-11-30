namespace WardActionList.Models;

public class WardActionListDatabaseSettings
{
  public string ConnectionString { get; set; } = null!;

  public string DatabaseName { get; set; } = null!;

  public string ActionsCollectionName { get; set; } = null!;
}