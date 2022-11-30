using WardActionList.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace WardActionList.Services;

public class WardActionService
{
    private readonly IMongoCollection<WardActionList.Models.Action> _actionCollection;

    public WardActionService(
        IOptions<WardActionListDatabaseSettings> WardActionDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            WardActionDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            WardActionDatabaseSettings.Value.DatabaseName);

        _actionCollection = mongoDatabase.GetCollection<WardActionList.Models.Action>(
            WardActionDatabaseSettings.Value.ActionsCollectionName);
    }

    public async Task<List<WardActionList.Models.Action>> GetAsync() =>
        await _actionCollection.Find(_ => true).ToListAsync();

    public async Task<WardActionList.Models.Action?> GetAsync(string id) =>
        await _actionCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(WardActionList.Models.Action newAction) =>
        await _actionCollection.InsertOneAsync(newAction);

    public async Task UpdateAsync(string id, WardActionList.Models.Action updatedAction) =>
        await _actionCollection.ReplaceOneAsync(x => x.Id == id, updatedAction);

    public async Task RemoveAsync(string id) =>
        await _actionCollection.DeleteOneAsync(x => x.Id == id);
}