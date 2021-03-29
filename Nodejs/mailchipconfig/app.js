// bring the mailcheck modules 
const mailchimp = require("@mailchimp/mailchimp_marketing")

mailchimp.setConfig({ 
    apiKey: "0bec30a1902d50532081aa2fe41ac587-us1",
    server: "us1"
});

async function run(){
    const response = await mailchimp.ping.get();
    console.log(response);
};

//run the function.
run();