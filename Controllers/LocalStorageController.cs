using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using System.IO;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace foodorder_app.Controllers
{
    [Route("[controller]")]
    public class LocalStorageController : Controller
    {
        [HttpGet("{id:int?}")]
        public IActionResult Get(int? id)
        {
            string localStorage = AppSettings.Get("LocalStorageFile") + (id.HasValue ? id.Value.ToString() : "");

            FileInfo fi = new FileInfo(localStorage);
            if (!fi.Exists) System.IO.File.WriteAllText(localStorage, "[]");
            return Content(System.IO.File.ReadAllText(localStorage), "application/json");
        }

        [HttpPost("{id:int?}")]
        async public Task<IActionResult> Post(int? id)
        {
            string localStorage = AppSettings.Get("LocalStorageFile") + (id.HasValue ? id.Value.ToString() : "");

            FileStream fs = new FileStream(localStorage, FileMode.Create);
            await HttpContext.Request.Body.CopyToAsync(fs);
            fs.Dispose();
            return Content("Saved successfully!");
        }
    }
}
