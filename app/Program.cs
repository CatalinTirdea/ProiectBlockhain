using Nethereum.Web3;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
/*
Strângere de fonduri pentru cauze umanitare.
Mai general, strângere de fonduri și repartizarea acestora în cadrul unei DAO.
Poate include un sistem de votare pentru repartizarea fondurilor
*/

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
}

app.UseHttpsRedirection();

app.Run();
