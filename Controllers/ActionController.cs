using WardActionList.Models;
using WardActionList.Services;
using Microsoft.AspNetCore.Mvc;

namespace WardActionList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActionsController : ControllerBase
{
  private readonly WardActionService _ActionService;

  public ActionsController(WardActionService actionService) =>
      _ActionService = actionService;

  [HttpGet]
  public async Task<List<WardActionList.Models.Action>> Get(){
    var actions = await _ActionService.GetAsync();
    return actions;
  }
      

  [HttpGet("{id:length(24)}")]
  public async Task<ActionResult<WardActionList.Models.Action>> Get(string id)
  {
    var action = await _ActionService.GetAsync(id);

    if (action is null)
    {
      return NotFound();
    }

    return action;
  }

  [HttpPost]
  public async Task<IActionResult> Post(WardActionList.Models.Action newAction)
  {
    if (newAction.Timestamp == null)
    {
      newAction.Timestamp = DateTime.Now.ToUniversalTime();
    }
    await _ActionService.CreateAsync(newAction);

    return CreatedAtAction(nameof(Get), new { id = newAction.Id }, newAction);
  }

  [HttpPut("{id:length(24)}")]
  public async Task<IActionResult> Update(string id, WardActionList.Models.Action updatedAction)
  {
    var action = await _ActionService.GetAsync(id);

    if (action is null)
    {
      return NotFound();
    }

    updatedAction.Id = action.Id;

    await _ActionService.UpdateAsync(id, updatedAction);

    return NoContent();
  }

  [HttpDelete("{id:length(24)}")]
  public async Task<IActionResult> Delete(string id)
  {
    var book = await _ActionService.GetAsync(id);

    if (book is null)
    {
      return NotFound();
    }

    await _ActionService.RemoveAsync(id);

    return NoContent();
  }
}