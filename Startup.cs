using System;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using FoodOrder;
using Microsoft.AspNet.Http.Features;
using Microsoft.Net.Http.Server;
using System.Threading.Tasks;
using Microsoft.AspNet.Http;
using System.Net.Http;
using System.IO;

namespace foodorder_app
{
    public class AppSettings {
        public static IConfigurationSection Configuration;

        public static string Get(string key) {
            return AppSettings.Configuration.GetSection(key).Value;
        }
    }

    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Adds a default in-memory implementation of IDistributedCache
            services.AddCaching();

            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.CookieName = ".AJMVCApp";
            });

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            AppSettings.Configuration = Configuration.GetSection("Settings");

            var listener = app.ServerFeatures.Get<Microsoft.Net.Http.Server.WebListener>();
            if (listener != null)
            {
                listener.AuthenticationManager.AuthenticationSchemes =
                    AuthenticationSchemes.NTLM;
            }

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseSession();
            app.UseDefaultFiles();

            app.UseStaticFiles();
            
            app.Map("/api", appProxy =>
            {
                appProxy.RunRhetosProxy(new ProxyOptions
                {
                    Host = "dprugovecki-pc.omega-software.hr",
                    Port = "80",
                    Scheme = "http",
                    HostPathBase = "/InstallRhetosTest/REST"
                });
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}"
                );
            });

        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
