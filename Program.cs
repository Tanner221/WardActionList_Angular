using Microsoft.EntityFrameworkCore;
using WardActionList.Models;
using WardActionList.Services;
using Microsoft.AspNetCore.Identity;
using WardActionList.Data;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("WardActionListIdentityContextConnection") ?? throw new InvalidOperationException("Connection string 'WardActionListIdentityContextConnection' not found.");

builder.Services.AddDbContext<WardActionListIdentityContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddDefaultIdentity<WardActionListUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<WardActionListIdentityContext>();

builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                      policy.WithOrigins("http://localhost:4200")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
                    }
  );
});
// Add services to the container.
builder.Services.Configure<WardActionListDatabaseSettings>(
  builder.Configuration.GetSection("WardActionListDatabase"));

builder.Services.AddSingleton<WardActionService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();;

app.UseAuthorization();

app.MapControllers();

app.Run();
