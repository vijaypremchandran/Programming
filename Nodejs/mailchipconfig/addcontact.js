// bring the mailcheck modules 
const mailchimp = require("@mailchimp/mailchimp_marketing")

mailchimp.setConfig({ 
    apiKey: "0bec30a1902d50532081aa2fe41ac587-us1",
    server: "us1"
});

const listId = "1adc9e2656";

const subscribingUser = {
  firstName: "Nandhinie",
  lastName: "Gopi chandran",
  email: "nandhiniegopichandran@gmail.com"
};

async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
  );
}

run();