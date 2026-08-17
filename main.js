

let GROUP_ID;
let headers = {
  "x-api-user": "",
  "x-api-key": "",
  "x-client": "Mill",
};

const misses = document.getElementById("misses");

const accept = document.getElementById("accept");
let accept_array_name_wait = []
let accept_array_name_start = [];


let wait = document.getElementById("wait");
let waiting_array_name_wait = []
let waiting_array_name_start = [];


const massage = document.getElementById("massage");

let accept_Hi_test = false;

//sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


//login

//login with everything
if (
  localStorage.getItem("remember_me") !== null &&
  localStorage.getItem("group") !== null &&
  localStorage.getItem("user") !== null
) {
  //прячет форму
  document.querySelector("#form").style.display = "none";
  // присваивание значений в обэкт и груповой айди
  headers["x-api-user"] = localStorage.getItem("user");
  headers["x-api-key"] = localStorage.getItem("remember_me");
  GROUP_ID = localStorage.getItem("group");
  // приведственая надпись
  Hi();
}

//login with user
else if (
  localStorage.getItem("group") !== null &&
  localStorage.getItem("user") !== null &&
  localStorage.getItem("remember_me") === null
) {
  //забирает форму для адйи
  document.querySelector("#ID").style.display = "none";

  document.getElementById("send").addEventListener("click", function (e) {
    // присваивание значения в обэкт
    headers["x-api-key"] = document.getElementById("API").value.trim();

    //тест на правильность заполнения
    if (!headers["x-api-key"]) {
      document.querySelector("#verify_error").textContent =
        "❌empty field API Token";
      return;
    }
    //забирает значения из ЛС
    headers["x-api-user"] = localStorage.getItem("user");
    GROUP_ID = localStorage.getItem("group");
    //забирает форму
    document.querySelector("#form").style.display = "none";
    // приведственая надпись
    Hi();

    //сохранение апи если выбрана такая опция
    if (document.querySelector("#remember_me").checked) {
      let warning = confirm(
        '⚠️ If you enable "Remember Me", your login credentials will be stored locally on this device.' +
          " Only use this option on devices you trust.",
      );
      if (warning) {
        localStorage.setItem("remember_me", headers["x-api-key"]);
      } else if (!warning) {
        console.log("cancel save data");
      } else {
        console.log("error");
      }
    }
  });
}

//register
else if (
  localStorage.getItem("group") === null &&
  localStorage.getItem("user") === null &&
  localStorage.getItem("remember_me") === null
) {
  document.getElementById("send").addEventListener("click", () => {
    // присваивание значений в обэкт
    headers["x-api-user"] = document.getElementById("ID").value.trim();
    headers["x-api-key"] = document.getElementById("API").value.trim();
    //тест на правильность заполнения
    if (!headers["x-api-user"] || !headers["x-api-key"]) {
      document.querySelector("#verify_error").textContent =
        "❌empty field in User ID or API Token";
      return;
    }
    //закрывает форму
    document.querySelector("#form").style.display = "none";
    // приведственая надпись

    //group_id
    (async () => {
      try {
        //находит груповое айди
        const group_ID_response = await fetch(
          `https://habitica.com/api/v3/members/${headers["x-api-user"]}`,
          { headers },
        );
        const data = await group_ID_response.json();
        const group_ID = data.data.party._id;

        if (data.success) {
          GROUP_ID = group_ID;
          document.querySelector("#verify_error").textContent = "✅Successful";
          //встанавлиает локал сторежд
          localStorage.setItem("user", headers["x-api-user"]);
          localStorage.setItem("group", group_ID);
          Hi();
          //сохраняет апи если пользователь хочет
          if (document.querySelector("#remember_me").checked) {
            let warning = confirm(
              '⚠️ If you enable "Remember Me", your login credentials will be stored locally on this device.' +
              ' Only use this option on devices you trust.',
            );
            if (warning) {
              localStorage.setItem("remember_me", headers["x-api-key"]);
            }
            else if (!warning) {
              console.log("cancel save data");
            }
          }
        } else {
          console.log("error");
        }
      } catch (error) {
        document.querySelector("#verify_error").textContent =
          "error login " + error;
      }
    })();
  });
}

// error
else {
  console.error("login or register error");
  alert("login or register error, please reload the page.");
  localStorage.clear();
}
//знопка cтирания даных
document.getElementById("delete_data").addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to delete your saved login information?",
  );

  if (!confirmed) {
    return;
  }

  localStorage.clear();
  location.reload();
});

//HI menu
async function Hi() {
  if (headers["x-api-key"] !== "" && headers["x-api-user"] !== "") {
    const response = await fetch(
      `https://habitica.com/api/v3/members/${headers["x-api-user"]}`,
      { headers },
    );

    const data = await response.json();

    document.querySelector("#Hi_name").textContent =
      `Hi ${data.data.profile.name}`;
  }
}



//вывод принявших
document.getElementById("load").addEventListener("click", async () => {

  const test = await fetch(
    `https://habitica.com/api/v3/groups/${GROUP_ID}/members?includeAllPublicFields=true`,
    { headers },
  );

  //вайб код *доработаный ии
  const data = await test.json();

  let RSVPN = [];
  let quest_key = [];
  let test_for_quest_peinding = "none";
  let num = 0;
  // На случай повторного запуска
  accept_array_name = [];
  waiting_array_name = [];

  for (const member of data.data) {
    const rsvp = member.party.quest.RSVPNeeded;
    const key = member.party.quest.key;


    RSVPN.push(rsvp);
    quest_key.push(key);

    // Определяем состояние квеста
    if (test_for_quest_peinding !== "pending") {
      if (rsvp === true) {
        test_for_quest_peinding = "pending";
      } else if (rsvp === false && key !== null) {
        test_for_quest_peinding = "start";
      }
    }
    //wait quest
    if (rsvp) {
      waiting_array_name_wait.push(member.auth.local.username);
    } else {
      accept_array_name_wait.push(member.auth.local.username);
    }
    //start quest
    if (quest_key[num] == null) {
      waiting_array_name_start.push(member.auth.local.username);
    } else {
      accept_array_name_start.push(member.auth.local.username);
    }
    num++;
  }

  if (test_for_quest_peinding === "pending") {
    accept.textContent = accept_array_name_wait.join("\n");
    wait.textContent = waiting_array_name_wait.join("\n");
    misses.style.display = "none";
    document.querySelector(".quest_num").style.display = "none";
  }
  else if (test_for_quest_peinding === "start") {
    accept.textContent = accept_array_name_start.join("\n");
    wait.textContent = waiting_array_name_start.join("\n");
    misses.style.display = "flex";
    document.querySelector(".quest_num").style.display = "flex";
  }

  console.info("status:", test_for_quest_peinding);
  console.log(RSVPN);
  console.log(quest_key);

  if (test_for_quest_peinding == "start") {
    console.log("Accepted:", accept_array_name_start);
    console.log("Waiting:", waiting_array_name_start);



    waiting_array_name_start.forEach((name, i) => {
      misses.insertAdjacentHTML(
        "beforeend",
        `
      <div>
        <span>${name}</span>

        <select id="miss_${i}">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="vacation">Vacation/Holiday</option>
        </select>
      </div>
    `,
      );
    });


  }
  else if (test_for_quest_peinding == "pending") {
    console.log("Accepted:", accept_array_name_wait);
    console.log("Waiting:", waiting_array_name_wait);
    // сообщение для копирования
    const message =
      "Quest reminder 😊\n\n" +
    waiting_array_name_wait.map((name) => `@${name}`).join(" ");
    console.log(message);
    massage.textContent = message;

  }



  document.getElementById("generate").addEventListener("click", () => {
    const quest_name = quest_key
    const filtered = quest_name.find((name) => name !== null);
    const quest_num = document.getElementById("quest_number");
    const message =
      `**Quest ${quest_num.value} - ${filtered}**\n\n` +
      "Non-participants (consecutive misses | expelled on 3rd):\n\n" +
      waiting_array_name_start
        .map((name, i) => {
          const misses = document.getElementById(`miss_${i}`).value;

          if (misses === "vacation") {
            return `-> @${name} (Vacation/Holiday)`;
          }

          return `-> @${name}: ${misses}`;
        })
        .join("\n\n");

    console.log(message);
    massage.textContent = message;
  });
});
