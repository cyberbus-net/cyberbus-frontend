// badge styles map
const badgeStyles: { [key: string]: string } = {
  alpha_user: "badge-gold",
  glorious_group_moderator: "badge-gold",
  closed_beta_user: "badge-silver",
  x7d12_user: "badge-silver",
  open_beta_user: "badge-bronze",
  public_open_beta_user: "badge-bronze",
};

const badgeIcons: { [key: string]: string } = {
  alpha_user_original:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_15-Medal" data-name="15-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#ffab02"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#ffda4d"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#ff9102"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#ffc400"/><polygon points="28 42 31 40 34 40 34 54 31 54 31 44 28 44 28 42" style="fill:#ff7802"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.051,3.051,0,0,0,10.228,40.4a.992.992,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.992.992,0,0,0,.226-.123A3.051,3.051,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.916A17.071,17.071,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.071,17.071,0,0,0-5.752,7.351l-4.924-1.916A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.93,12.93,0,0,0-.56-2.168l-1.886.666A11.008,11.008,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.048,13.048,0,0,0,32,34Z"/><path d="M31,55h3a1,1,0,0,0,1-1V40a1,1,0,0,0-1-1H31a1.006,1.006,0,0,0-.555.168l-3,2A1,1,0,0,0,27,42v2a1,1,0,0,0,1,1h2v9A1,1,0,0,0,31,55ZM29,43v-.465L31.3,41H33V53H32V44a1,1,0,0,0-1-1Z"/></g></svg>', // Replace with actual SVG content or path
  alpha_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_15-Medal" data-name="15-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#ffab02"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#ffda4d"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#ff9102"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#ffc400"/><polygon points="28 42 31 40 34 40 34 54 31 54 31 44 28 44 28 42" style="fill:#ff7802"/></g></svg>',
  closed_beta_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_16-Medal" data-name="16-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#a8b7d4"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#edf4fa"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#8394b2"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#c1cfe8"/><path d="M32,43a1.959,1.959,0,0,1,2,2c0,2-6,6-6,6v3h9V51H33l2.586-2.586A4.828,4.828,0,0,0,37,45h0s0-5-5-5-5,5-5,5h3A1.959,1.959,0,0,1,32,43Z" style="fill:#5c6979"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.052,3.052,0,0,0,10.228,40.4a.971.971,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.971.971,0,0,0,.226-.123A3.052,3.052,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.917A17.068,17.068,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.068,17.068,0,0,0-5.752,7.352l-4.924-1.917A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.831,12.831,0,0,0-.56-2.168l-1.885.666A11.1,11.1,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.049,13.049,0,0,0,32,34Z"/><path d="M38,45a5.785,5.785,0,0,0-6-6,5.785,5.785,0,0,0-6,6,1,1,0,0,0,1,1h3a1.012,1.012,0,0,0,1-.988A1,1,0,1,1,33,45c0,.766-2.647,3.229-5.555,5.168A1,1,0,0,0,27,51v3a1,1,0,0,0,1,1h9a1,1,0,0,0,1-1V51a1,1,0,0,0-1-1H35.414l.879-.879A5.868,5.868,0,0,0,38,45Zm-3.121,2.707-2.586,2.586A1,1,0,0,0,33,52h3v1H29V51.531c2.105-1.444,6-4.4,6-6.531a2.916,2.916,0,0,0-3-3,2.818,2.818,0,0,0-2.833,2H28.131A3.657,3.657,0,0,1,32,41a3.95,3.95,0,0,1,2.879,6.707Z"/></g></svg>',
  open_beta_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="_17-Medal" data-name="17-Medal"><path d="M41,9V33.76a16.054,16.054,0,0,0-18,0V9Z" style="fill:#edf4fa"/><path d="M54,9V37.93a2.046,2.046,0,0,1-.82,1.66l-6,2.34A16.088,16.088,0,0,0,41,33.76V9Z" style="fill:#9c59a9"/><path d="M23,9V33.76a16.088,16.088,0,0,0-6.18,8.17l-6-2.34A2.046,2.046,0,0,1,10,37.93V9Z" style="fill:#9c59a9"/><path d="M47.18,41.93A15.971,15.971,0,1,1,41,33.76,16.031,16.031,0,0,1,47.18,41.93ZM44,47A12,12,0,1,0,32,59,12,12,0,0,0,44,47Z" style="fill:#e84840"/><path d="M32,35A12,12,0,1,1,20,47,12,12,0,0,1,32,35Z" style="fill:#ff4f46"/><polygon points="56 1 56 9 54 9 41 9 23 9 10 9 8 9 8 1 56 1" style="fill:#c1cfe8"/><path d="M8,1V9H56V5H16a2,2,0,0,1-2-2V1Z" style="fill:#8394b2"/><path d="M32,33A14,14,0,1,0,46,47,14,14,0,0,0,32,33Zm0,26A12,12,0,1,1,44,47,12,12,0,0,1,32,59Z" style="fill:#ad362f"/><path d="M36,14h5V9H23V33.76A15.984,15.984,0,0,1,32,31V18A4,4,0,0,1,36,14Z" style="fill:#c1cfe8"/><rect x="41" y="9" width="13" height="5" style="fill:#774e9d"/><path d="M10,9V37.93a2.046,2.046,0,0,0,.82,1.66l6,2.34A16.088,16.088,0,0,1,23,33.76V9Z" style="fill:#774e9d"/><path d="M24,43a11.925,11.925,0,0,1,1.762-6.238A11.992,11.992,0,1,0,42.238,53.238,11.983,11.983,0,0,1,24,43Z" style="fill:#db443d"/><path d="M31,47c1.658,0,3,.9,3,2a2,2,0,0,1-4,0H27v1c0,2.211,2.236,4,5,4s5-1.789,5-4a3.674,3.674,0,0,0-1-3,3.674,3.674,0,0,0,1-3c0-2.211-2.236-4-5-4s-5,1.789-5,4v1h3a2,2,0,0,1,4,0C34,46.105,32.658,47,31,47Z" style="fill:#fff"/><path d="M32,39c-3.309,0-6,2.243-6,5v1a1,1,0,0,0,1,1h3a1.012,1.012,0,0,0,1-.988A1,1,0,1,1,33,45c0,.408-.779,1-2,1a1,1,0,0,0,0,2c1.221,0,2,.592,2,.988A1,1,0,1,1,31,49a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1v1c0,2.757,2.691,5,6,5s6-2.243,6-5a4.978,4.978,0,0,0-.709-3A4.978,4.978,0,0,0,38,44C38,41.243,35.309,39,32,39Zm3.293,8.707A2.737,2.737,0,0,1,36,50c0,1.654-1.794,3-4,3s-4-1.346-4-3h1.167A2.818,2.818,0,0,0,32,52a2.916,2.916,0,0,0,3-3,2.617,2.617,0,0,0-.995-2A2.617,2.617,0,0,0,35,45a2.916,2.916,0,0,0-3-3,2.818,2.818,0,0,0-2.833,2H28c0-1.654,1.794-3,4-3s4,1.346,4,3a2.737,2.737,0,0,1-.707,2.293A1,1,0,0,0,35.293,47.707Z"/><path d="M56,0H19V2H55V8H9V2h4V0H8A1,1,0,0,0,7,1V9a1,1,0,0,0,1,1H9V37.93A3.052,3.052,0,0,0,10.228,40.4a.971.971,0,0,0,.226.123l5.161,2.009a17,17,0,1,0,32.77,0l5.161-2.009a.971.971,0,0,0,.226-.123A3.052,3.052,0,0,0,55,37.93V10h1a1,1,0,0,0,1-1V1A1,1,0,0,0,56,0ZM32,62A15,15,0,1,1,47,47,15.017,15.017,0,0,1,32,62ZM53,37.93a1.089,1.089,0,0,1-.324.788l-4.924,1.917A17.068,17.068,0,0,0,42,33.283V14H40V32.008a16.94,16.94,0,0,0-16,0V28H22v5.283a17.068,17.068,0,0,0-5.752,7.352l-4.924-1.917A1.089,1.089,0,0,1,11,37.93V10H22V26h2V10H40v2h2V10H53Z"/><rect x="15" width="2" height="2"/><path d="M42.848,45.165l1.972-.33a12.831,12.831,0,0,0-.56-2.168l-1.885.666A11.1,11.1,0,0,1,42.848,45.165Z"/><path d="M32,34A13,13,0,1,0,45,47H43a10.995,10.995,0,1,1-1.471-5.5l1.731-1A13.049,13.049,0,0,0,32,34Z"/></g></svg>',
  glorious_group_moderator:
    '<svg version="1.1" id="Icon_Set" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256" xml:space="preserve"><style>.st9{fill:#d4e7f8}.st10{fill:#a3d0f1}.st11{fill:#4c4372}.st13{fill:#fd919e}</style><circle cx="128" cy="128.625" r="104.245" style="fill:#f1c48b"/><path class="st9" d="M184.868 207.333H71.132V172.37c0-11.985 9.716-21.701 21.701-21.701h70.333c11.985 0 21.701 9.716 21.701 21.701v34.963z"/><path class="st10" d="M163.166 150.669h-10.385c11.985 0 21.701 9.716 21.701 21.701v34.963h10.385V172.37c.001-11.985-9.715-21.701-21.701-21.701z"/><path class="st13" d="M184.868 173.75h-10.385v15.741a3.759 3.759 0 0 0 3.759 3.759h6.626v-19.5zM71.132 173.75h10.385v15.741a3.759 3.759 0 0 1-3.759 3.759h-6.626v-19.5z"/><path class="st10" d="M138.385 150.669H99.149L128 190.5l28.851-39.831z"/><path class="st13" d="M141.104 172.445 128 164.5l-13.078 7.945L128 190.5z"/><path class="st11" d="M128 193.5a3.001 3.001 0 0 1-2.43-1.24l-28.852-39.831a3 3 0 0 1 2.43-4.76h57.703a3.001 3.001 0 0 1 2.43 4.76L130.43 192.26a3.001 3.001 0 0 1-2.43 1.24zm-22.975-39.831L128 185.386l22.975-31.717h-45.95z"/><path class="st11" d="M184.867 210.333H71.133a3 3 0 0 1-3-3V172.37c0-13.62 11.081-24.701 24.701-24.701h70.332c13.62 0 24.701 11.081 24.701 24.701v34.963a3 3 0 0 1-3 3zm-110.734-6h107.734V172.37c0-10.312-8.39-18.701-18.701-18.701H92.834c-10.312 0-18.701 8.39-18.701 18.701v31.963z"/><path class="st9" d="M174 61.646c0 8.825-20.595 10.979-46 10.979s-46-2.154-46-10.979 20.595-20.979 46-20.979 46 12.154 46 20.979z"/><path class="st11" d="M128 75.625c-34.804 0-49-4.05-49-13.979 0-10.861 21.857-23.979 49-23.979s49 13.118 49 23.979c0 9.929-14.196 13.979-49 13.979zm0-31.958c-24.842 0-43 11.825-43 17.979 0 2.398 4.19 7.979 43 7.979s43-5.58 43-7.979c0-6.154-18.158-17.979-43-17.979z"/><path class="st9" d="M138.385 150.669v-13.91c-3.223 1.434-6.723 2.228-10.385 2.228s-7.162-.794-10.385-2.228v13.91L128 164.5l10.385-13.831z"/><path d="M150.635 91.182h-45.271c-2.201 0-4.271-.54-6.103-1.48a29.019 29.019 0 0 0-.113 2.496v17.644c0 15.934 12.917 28.851 28.851 28.851s28.851-12.917 28.851-28.851V92.198a29 29 0 0 0-.113-2.496 13.316 13.316 0 0 1-6.102 1.48z" style="fill:#fff"/><path class="st9" d="M150.635 91.182h-45.271c-7.402 0-13.402-6-13.402-13.402h72.075c0 7.402-6 13.402-13.402 13.402z"/><path class="st10" d="M148.745 77.78c0 7.402-6 13.402-13.402 13.402h15.292c7.402 0 13.402-6 13.402-13.402h-15.292z"/><path class="st13" d="M99.149 67.471h57.703V77.78H99.149z"/><path style="fill:#e0667d" d="M145.197 67.471h11.655V77.78h-11.655z"/><path class="st9" d="M156.738 89.702a13.327 13.327 0 0 1-6.103 1.48h-4.193c.013.338.024.675.024 1.016v17.644c0 14.16-10.204 25.929-23.659 28.376a28.94 28.94 0 0 0 5.193.475c15.934 0 28.851-12.917 28.851-28.851V92.198c0-.841-.041-1.673-.113-2.496zM99.149 109.842V92.198c0-.377.014-.751.028-1.124h-4.482c-5.493 0-9.946 4.453-9.946 9.946 0 5.493 4.453 9.946 9.946 9.946h4.482a29.898 29.898 0 0 1-.028-1.124z"/><path class="st9" d="M161.305 91.074h-4.482c.014.374.028.747.028 1.124v17.644c0 .377-.014.751-.028 1.124h4.482c5.493 0 9.946-4.453 9.946-9.946.001-5.493-4.452-9.946-9.946-9.946z"/><path class="st11" d="M99.177 113.967h-4.482c-7.139 0-12.946-5.808-12.946-12.946s5.808-12.946 12.946-12.946h4.482a3 3 0 0 1 2.998 3.109c-.014.383-.026.697-.026 1.015v17.645c0 .315.012.629.023.941.03.814-.271 1.642-.837 2.229s-1.344.953-2.158.953zm-4.483-19.893c-3.83 0-6.946 3.116-6.946 6.946s3.116 6.946 6.946 6.946h1.454V94.074h-1.454zM161.306 113.967h-4.482a3 3 0 0 1-2.998-3.109c.015-.386.026-.699.026-1.015V92.198c0-.317-.013-.632-.023-.946-.03-.814.271-1.64.836-2.226.565-.587 1.345-.952 2.159-.952h4.482c7.139 0 12.946 5.808 12.946 12.946s-5.808 12.947-12.946 12.947zm-1.454-6h1.454c3.83 0 6.946-3.116 6.946-6.946s-3.116-6.946-6.946-6.946h-1.454v13.892z"/><path class="st11" d="M150.636 94.182h-45.271c-9.044 0-16.401-7.357-16.401-16.401a3 3 0 0 1 3-3h72.074a3 3 0 0 1 3 3c-.001 9.043-7.358 16.401-16.402 16.401zM95.403 80.78c1.291 4.277 5.268 7.401 9.961 7.401h45.271c4.693 0 8.67-3.124 9.961-7.401H95.403z"/><path class="st11" d="M156.852 80.78H99.148a3 3 0 0 1-3-3V67.47a3 3 0 0 1 3-3h57.703a3 3 0 0 1 3 3v10.31a2.998 2.998 0 0 1-2.999 3zm-54.704-6h51.703v-4.31h-51.703v4.31zM128 141.693c-17.563 0-31.852-14.288-31.852-31.851V92.198c0-.887.041-1.788.124-2.755a3.002 3.002 0 0 1 4.358-2.411 10.27 10.27 0 0 0 4.733 1.149h45.271c1.654 0 3.247-.387 4.733-1.149a3.002 3.002 0 0 1 4.358 2.411c.083.967.124 1.868.124 2.755v17.645c.003 17.562-14.286 31.85-31.849 31.85zm-25.852-47.828v15.978c0 14.254 11.597 25.851 25.852 25.851s25.852-11.597 25.852-25.851V93.865c-1.051.21-2.125.316-3.216.316h-45.271a16.316 16.316 0 0 1-3.217-.316z"/><path class="st11" d="M128 167.5a3.003 3.003 0 0 1-2.399-1.198l-10.386-13.831a3.003 3.003 0 0 1-.601-1.802V136.76a3.002 3.002 0 0 1 4.219-2.742c5.879 2.613 12.455 2.613 18.334 0a3 3 0 0 1 4.219 2.742v13.909c0 .649-.211 1.282-.601 1.802l-10.386 13.831A3.003 3.003 0 0 1 128 167.5zm-7.386-17.832 7.386 9.836 7.386-9.836v-8.663a28.312 28.312 0 0 1-14.771 0v8.663zM128 61a5.292 5.292 0 0 1-5.292-5.292v-6.665c0-.852.691-1.543 1.543-1.543h7.499c.852 0 1.543.691 1.543 1.543v6.665A5.293 5.293 0 0 1 128 61zM92.481 210.333a3 3 0 0 1-3-3v-21.416a3 3 0 1 1 6 0v21.416a3 3 0 0 1-3 3zM163.519 210.333a3 3 0 0 1-3-3v-21.416a3 3 0 1 1 6 0v21.416a3 3 0 0 1-3 3z"/><path class="st11" d="M128 193.5a3.003 3.003 0 0 1-2.43-1.24l-13.078-18.056a3 3 0 0 1 .872-4.325l13.078-7.944a3.002 3.002 0 0 1 3.113-.001l13.104 7.944a2.997 2.997 0 0 1 .872 4.327l-13.104 18.056A2.995 2.995 0 0 1 128 193.5zm-8.74-20.181 8.742 12.069 8.76-12.068-8.76-5.312-8.742 5.311zM184.867 196.25h-6.626a6.767 6.767 0 0 1-6.759-6.759V173.75a3 3 0 0 1 3-3h10.385a3 3 0 0 1 3 3v19.5a3 3 0 0 1-3 3zm-7.385-19.5v12.741a.76.76 0 0 0 .759.759h3.626v-13.5h-4.385zM77.759 196.25h-6.626a3 3 0 0 1-3-3v-19.5a3 3 0 0 1 3-3h10.385a3 3 0 0 1 3 3v15.741a6.767 6.767 0 0 1-6.759 6.759zm-3.626-6h3.626a.76.76 0 0 0 .759-.759V176.75h-4.385v13.5z"/><path class="st11" d="M128 210.333a3 3 0 0 1-3-3V190.5a3 3 0 1 1 6 0v16.833a3 3 0 0 1-3 3z"/></svg>',
  x7d12_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xml:space="preserve"><switch><g><circle fill="#382B73" cx="500" cy="500" r="398"/><circle fill="#473080" cx="500" cy="500" r="344.3"/><path fill="#382B73" d="M757.1 656.6c.1-.3.1-.5.1-.7V655.1l-11.5-78.8c-.7-4.7-2.6-9-5.7-12.7l-17.7-21.3-7-8.4v-.1l-1.1-1.4c-3.4-4.1-8.6-6.5-13.9-6.5H603.4l-3.5-24.3h125.8c1.6 0 3.1-.4 4.5-1h.1c6.2-2.3 10.6-8.1 10.9-14.8 0-.2.1-.3.1-.5v-1l-10.6-72.4c-.6-4.3-2.4-8.3-5.2-11.6L708.8 381l-6.4-7.7v-.1l-1-1.2c-3.2-3.8-7.9-6-12.8-6H427.4c-4.9 0-9.6 2.2-12.8 6l-1 1.2v.1l-6.4 7.7-16.3 19.5c-2.8 3.3-4.6 7.3-5.2 11.6l-4.8 33h-85.6c-4.9 0-9.6 2.2-12.8 6l-1 1.2v.1l-6.4 7.7-16.3 19.5c-2.8 3.3-4.6 7.3-5.2 11.6L243 563.6v1c0 .2.1.3.1.5.3 6.7 4.7 12.5 10.9 14.8h.1c1.3.6 2.8 1 4.5 1h111.3l-10.8 74.2V655.9c0 .2 0 .4.1.6V656.8c.3 7.3 5.1 13.6 11.8 16.1h.1c1.4.7 3.1 1.1 4.9 1.1H740.8c1.8 0 3.4-.4 4.9-1.1h.1c6.7-2.5 11.5-8.8 11.8-16.1-.5-.1-.5-.1-.5-.2z"/><g><path fill="#FFF335" d="m740.6 462.8-10.2-69.6c-.7-5-2.9-9.7-6.1-13.6l-21.9-26.3v-.1l-1-1.2c-3.2-3.8-7.9-6-12.8-6H427.4c-4.9 0-9.6 2.2-12.8 6l-1 1.2v.1l-21.9 26.3c-3.3 3.9-5.4 8.6-6.1 13.6l-10.2 69.6c-.2 1.1-.2 2.2-.2 3.2.3 6.7 4.7 12.5 10.9 14.8h.1c1.8.6 3.7 1 5.7 1H724.2c2 0 3.9-.4 5.7-1h.1c6.2-2.3 10.6-8.1 10.9-14.8 0-1.1-.1-2.2-.3-3.2z"/><path fill="#F7CB15" d="m417.6 405.3-36.2 61.4c-1.9 3.3-6.9 1.5-6.4-2.2l10.6-72.4c.6-4.3 2.4-8.3 5.2-11.6l22.9-27.5c2-2.4 5.9-1 5.9 2.1v42.8c0 2.6-.7 5.2-2 7.4z"/><path fill="#FEDE3A" d="M685.2 346H430.7c-6.1 0-11.1 5-11.1 11.1v28.2c0 9.2 7.5 16.7 16.7 16.7h243.4c9.2 0 16.7-7.5 16.7-16.7v-28.2c-.1-6.2-5.1-11.1-11.2-11.1z"/><path fill="#F7CB15" d="m698.3 405.3 36.2 61.4c1.9 3.3 6.9 1.5 6.4-2.2l-10.6-72.4c-.6-4.3-2.4-8.3-5.2-11.6L702.2 353c-2-2.4-5.9-1-5.9 2.1v42.8c0 2.6.7 5.2 2 7.4z"/><path fill="#E7AD27" d="M734.6 466.8s0-.1 0 0c-.1-.2-.2-.4-.3-.5l-35-59.3c-1.9-3.1-5.2-5-8.9-5H425.5c-3.6 0-7 1.9-8.9 5l-35 59.3c-.1.1-.2.3-.2.4v.1c-2.8 5.3-.3 11.6 4.6 14h.1c1.3.6 2.8 1 4.5 1h334.9c1.6 0 3.1-.4 4.5-1h.1c4.8-2.4 7.3-8.7 4.5-14z"/><g><path fill="#FFF335" d="M416.2 351.8c-.9 0-1.8.4-2.5 1.2l-22.9 27.5c-2.8 3.3-4.6 7.3-5.2 11.6L375 464.5c-.3 2.4 1.5 3.9 3.5 3.9 1.1 0 2.2-.5 2.9-1.7l36.2-61.4c1.3-2.2 2-4.8 2-7.4v-42.8c0-2-1.7-3.3-3.4-3.3zm-2.2 46.1c0 1.6-.4 3.2-1.2 4.6l-30.7 52.1 9-61.7c.5-3.3 1.8-6.3 4-8.9l19-22.8v36.7zM740.9 464.5l-10.6-72.4c-.6-4.3-2.4-8.3-5.2-11.6L702.2 353c-.7-.8-1.6-1.2-2.5-1.2-1.7 0-3.4 1.3-3.4 3.3v42.8c0 2.6.7 5.1 2 7.4l36.2 61.4c.7 1.2 1.8 1.7 2.9 1.7 2 0 3.8-1.6 3.5-3.9zm-37.8-62c-.8-1.4-1.2-3-1.2-4.6v-36.6l19 22.8c2.1 2.5 3.5 5.6 4 8.9l9 61.7-30.8-52.2z"/><path fill="#FFF335" d="M685.2 346H430.7c-6.1 0-11.1 5-11.1 11.1v28.2c0 9.2 7.5 16.7 16.7 16.7h243.4c9.2 0 16.7-7.5 16.7-16.7v-28.2c-.1-6.2-5.1-11.1-11.2-11.1zm5.6 39.2c0 6.1-5 11.1-11.1 11.1H436.2c-6.1 0-11.1-5-11.1-11.1V357c0-3.1 2.5-5.6 5.6-5.6h254.6c3.1 0 5.6 2.5 5.6 5.6v28.2zM734.6 466.8s0-.1 0 0c-.1-.2-.2-.4-.3-.5l-35-59.3c-1.9-3.1-5.2-5-8.9-5H425.5c-3.6 0-7 1.9-8.9 5l-35 59.3c-.1.1-.2.3-.2.4v.1c-2.8 5.3-.3 11.6 4.6 14h.1c1.3.6 2.8 1 4.5 1h334.9c1.6 0 3.1-.4 4.5-1h.1c4.8-2.4 7.3-8.7 4.5-14zm-4.7 6.2c-.4 1.2-1.3 2.2-2.3 2.8 0 0-.1 0-.1.1-.6.3-1.3.5-2.1.5H390.5c-.7 0-1.4-.2-2.1-.4 0 0-.1 0-.1-.1-1.1-.6-1.9-1.6-2.3-2.8-.3-.8-.4-2.1.2-3.5.1-.1.2-.3.2-.4l34.9-59.1c0-.1.1-.1.1-.2.8-1.4 2.4-2.3 4.1-2.3h265c1.7 0 3.2.9 4.1 2.3 0 .1.1.1.1.2l34.9 59.1c.1.1.1.3.2.4.6 1.3.4 2.6.1 3.4z"/></g><g><path fill="#FFF335" d="m608.5 541.9-10.2-69.6c-.7-5-2.9-9.7-6.1-13.6l-21.9-26.3v-.1l-1-1.2c-3.2-3.8-7.9-6-12.8-6H295.2c-4.9 0-9.6 2.2-12.8 6l-1 1.2v.1l-21.9 26.3c-3.3 3.9-5.4 8.6-6.1 13.6l-10.2 69.6c-.2 1.1-.2 2.2-.2 3.2.3 6.7 4.7 12.5 10.9 14.8h.1c1.8.6 3.7 1 5.7 1H592c2 0 3.9-.4 5.7-1h.1c6.2-2.3 10.6-8.1 10.9-14.8 0-1.1-.1-2.1-.2-3.2z"/><path fill="#F7CB15" d="m285.4 484.4-36.2 61.4c-1.9 3.3-6.9 1.5-6.4-2.2l10.6-72.4c.6-4.3 2.4-8.3 5.2-11.6l22.9-27.5c2-2.4 5.9-1 5.9 2.1V477c0 2.6-.7 5.2-2 7.4z"/><path fill="#FEDE3A" d="M553 425.1H298.5c-6.1 0-11.1 5-11.1 11.1v28.2c0 9.2 7.5 16.7 16.7 16.7h243.4c9.2 0 16.7-7.5 16.7-16.7v-28.2c-.1-6.2-5-11.1-11.2-11.1z"/><path fill="#F7CB15" d="m566.1 484.4 36.2 61.4c1.9 3.3 6.9 1.5 6.4-2.2l-10.6-72.4c-.6-4.3-2.4-8.3-5.2-11.6L570 432.1c-2-2.4-5.9-1-5.9 2.1V477c0 2.6.7 5.2 2 7.4z"/><path fill="#E7AD27" d="M602.4 545.9c-.1-.2-.2-.4-.3-.5l-35-59.3c-1.9-3.1-5.2-5-8.9-5H293.3c-3.6 0-7 1.9-8.9 5l-35 59.3c-.1.1-.2.3-.2.4v.1c-2.8 5.3-.3 11.6 4.6 14h.1c1.3.6 2.8 1 4.5 1h335c1.6 0 3.1-.4 4.5-1h.1c4.7-2.4 7.2-8.7 4.4-14z"/><g><path fill="#FFF335" d="M284 430.9c-.9 0-1.8.4-2.5 1.2l-22.9 27.5c-2.8 3.3-4.6 7.3-5.2 11.6l-10.6 72.4c-.3 2.4 1.5 3.9 3.5 3.9 1.1 0 2.2-.5 2.9-1.7l36.2-61.4c1.3-2.2 2-4.8 2-7.4v-42.8c0-2-1.7-3.3-3.4-3.3zm-2.2 46.1c0 1.6-.4 3.2-1.2 4.6l-30.7 52.1 9-61.7c.5-3.3 1.8-6.3 4-8.9l19-22.8V477zM608.7 543.6l-10.6-72.4c-.6-4.3-2.4-8.3-5.2-11.6L570 432.1c-.7-.8-1.6-1.2-2.5-1.2-1.7 0-3.4 1.3-3.4 3.3V477c0 2.6.7 5.1 2 7.4l36.2 61.4c.7 1.2 1.8 1.7 2.9 1.7 2 0 3.9-1.5 3.5-3.9zm-37.8-62c-.8-1.4-1.2-3-1.2-4.6v-36.6l19 22.8c2.1 2.5 3.5 5.6 4 8.9l9 61.7-30.8-52.2z"/><path fill="#FFF335" d="M553 425.1H298.5c-6.1 0-11.1 5-11.1 11.1v28.2c0 9.2 7.5 16.7 16.7 16.7h243.4c9.2 0 16.7-7.5 16.7-16.7v-28.2c-.1-6.2-5-11.1-11.2-11.1zm5.6 39.2c0 6.1-5 11.1-11.1 11.1H304.1c-6.1 0-11.1-5-11.1-11.1v-28.2c0-3.1 2.5-5.6 5.6-5.6H553c3.1 0 5.6 2.5 5.6 5.6v28.2z"/><path fill="#FFF335" d="M602.4 545.9c-.1-.2-.2-.4-.3-.5l-35-59.3c-1.9-3.1-5.2-5-8.9-5H293.3c-3.6 0-7 1.9-8.9 5l-35 59.3c-.1.1-.2.3-.2.4v.1c-2.8 5.3-.3 11.6 4.6 14h.1c1.3.6 2.8 1 4.5 1h335c1.6 0 3.1-.4 4.5-1h.1c4.7-2.4 7.2-8.7 4.4-14zm-4.6 6.2c-.4 1.2-1.3 2.2-2.3 2.8 0 0-.1 0-.1.1-.6.3-1.3.5-2.1.5h-335c-.7 0-1.4-.2-2.1-.4 0 0-.1 0-.1-.1-1.1-.6-1.9-1.6-2.3-2.8-.3-.8-.4-2.1.2-3.5.1-.1.2-.3.2-.4l34.9-59.1c0-.1.1-.1.1-.2.8-1.4 2.4-2.3 4.1-2.3h265c1.7 0 3.2.9 4.1 2.3 0 .1.1.1.1.2l34.9 59.1c.1.1.1.3.2.4.6 1.3.4 2.6.2 3.4z"/></g></g><g><path fill="#FFF335" d="m756.9 633.3-11.1-75.8c-.8-5.5-3.1-10.6-6.7-14.9L715.3 514v-.1l-1.1-1.4c-3.4-4.1-8.6-6.5-13.9-6.5H415.8c-5.4 0-10.5 2.4-13.9 6.5l-1.1 1.4v.1l-23.9 28.7c-3.6 4.2-5.9 9.4-6.7 14.9L359 633.3c-.2 1.2-.2 2.4-.2 3.5.3 7.3 5.1 13.6 11.8 16.1h.1c1.9.7 4 1.1 6.2 1.1h362c2.2 0 4.3-.4 6.2-1.1h.1c6.7-2.5 11.5-8.8 11.8-16.1.1-1.2.1-2.3-.1-3.5z"/><path fill="#F7CB15" d="m405.1 570.7-39.4 66.9c-2.1 3.5-7.5 1.6-6.9-2.4l11.5-78.8c.7-4.7 2.6-9 5.7-12.7l25-29.9c2.2-2.6 6.4-1.1 6.4 2.3v46.6c-.1 2.8-.9 5.6-2.3 8z"/><path fill="#FEDE3A" d="M696.5 506.1H419.4c-6.7 0-12.1 5.4-12.1 12.1v30.7c0 10 8.1 18.1 18.1 18.1h265.1c10 0 18.1-8.1 18.1-18.1v-30.7c0-6.7-5.4-12.1-12.1-12.1z"/><path fill="#F7CB15" d="m710.8 570.7 39.4 66.9c2.1 3.5 7.5 1.6 6.9-2.4l-11.5-78.8c-.7-4.7-2.6-9-5.7-12.7l-25-29.9c-2.2-2.6-6.4-1.1-6.4 2.3v46.6c.1 2.8.9 5.6 2.3 8z"/><path fill="#E7AD27" d="M750.3 637.7c0-.1 0-.1 0 0l-.3-.6-38.1-64.6c-2-3.4-5.7-5.5-9.6-5.5H413.7c-3.9 0-7.6 2.1-9.6 5.5L366 637.1c-.1.2-.2.3-.3.5v.1c-3 5.8-.4 12.6 5.1 15.3h.1c1.4.7 3.1 1.1 4.9 1.1h364.6c1.8 0 3.4-.4 4.9-1.1h.1c5.3-2.7 7.9-9.5 4.9-15.3z"/><g><path fill="#FFF335" d="M403.6 512.5c-1 0-2 .4-2.8 1.3l-25 29.9c-3 3.6-5 8-5.7 12.7l-11.5 78.8c-.4 2.6 1.7 4.3 3.8 4.3 1.2 0 2.4-.6 3.2-1.9l39.4-66.9c1.4-2.4 2.2-5.2 2.2-8v-46.6c.1-2.2-1.7-3.6-3.6-3.6zm-2.4 50.2c0 1.7-.5 3.5-1.4 5l-33.5 56.8 9.8-67.2c.5-3.6 2-6.9 4.3-9.7l20.7-24.8v39.9zM757.2 635.2l-11.5-78.8c-.7-4.7-2.6-9-5.7-12.7l-25-29.9c-.8-.9-1.8-1.3-2.8-1.3-1.9 0-3.7 1.4-3.7 3.6v46.6c0 2.8.8 5.6 2.2 8l39.4 66.9c.8 1.3 2 1.9 3.2 1.9 2.2 0 4.3-1.8 3.9-4.3zM716 567.6c-.9-1.5-1.4-3.2-1.4-5v-39.9l20.7 24.8c2.3 2.8 3.8 6.1 4.3 9.7l9.8 67.2-33.4-56.8z"/><path fill="#FFF335" d="M696.5 506.1H419.4c-6.7 0-12.1 5.4-12.1 12.1v30.7c0 10 8.1 18.1 18.1 18.1h265.1c10 0 18.1-8.1 18.1-18.1v-30.7c0-6.7-5.4-12.1-12.1-12.1zm6.1 42.7c0 6.7-5.4 12.1-12.1 12.1H425.4c-6.7 0-12.1-5.4-12.1-12.1v-30.7c0-3.3 2.7-6 6-6H696.6c3.3 0 6 2.7 6 6v30.7z"/><path fill="#FFF335" d="M750.3 637.7c0-.1 0-.1 0 0l-.3-.6-38.1-64.6c-2-3.4-5.7-5.5-9.6-5.5H413.7c-3.9 0-7.6 2.1-9.6 5.5L366 637.1c-.1.2-.2.3-.3.5v.1c-3 5.8-.4 12.6 5.1 15.3h.1c1.4.7 3.1 1.1 4.9 1.1h364.6c1.8 0 3.4-.4 4.9-1.1h.1c5.3-2.7 7.9-9.5 4.9-15.3zm-5 6.7c-.4 1.3-1.4 2.4-2.6 3 0 0-.1 0-.1.1-.7.3-1.4.5-2.3.5H375.6c-.8 0-1.6-.2-2.2-.5-.1 0-.1-.1-.2-.1-1.2-.6-2.1-1.7-2.5-3-.3-.9-.5-2.3.2-3.8.1-.1.2-.3.2-.5l38-64.4c0-.1.1-.1.1-.2.9-1.6 2.6-2.5 4.4-2.5H702.3c1.8 0 3.5 1 4.4 2.5 0 .1.1.2.1.2l38 64.4c.1.2.2.3.2.5.7 1.5.6 2.9.3 3.8z"/></g></g></g></g></switch></svg>',
  public_open_beta_user:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><path style="fill:#d25459" d="M213.408 18.795c23.424 7.778 61.755 7.778 85.179 0l25.45-8.451c23.425-7.778 46.663 5.637 51.638 29.813l5.406 26.266c4.977 24.176 24.142 57.371 42.591 73.769l20.043 17.816c18.449 16.396 18.449 43.229 0 59.625l-20.043 17.816c-18.449 16.398-37.615 49.593-42.591 73.769l-5.406 26.266c-4.976 24.176-28.213 37.592-51.638 29.814l-25.45-8.451c-23.424-7.778-61.755-7.778-85.179 0l-25.45 8.451c-23.424 7.778-46.661-5.637-51.638-29.814l-5.406-26.266c-4.977-24.176-24.142-57.371-42.59-73.769L68.28 217.633c-18.449-16.396-18.449-43.229 0-59.625l20.044-17.816c18.448-16.398 37.612-49.593 42.59-73.769l5.406-26.266c4.977-24.176 28.214-37.592 51.638-29.813l25.45 8.451z"/><path style="fill:#0071ce" d="M329.859 235.188H182.144v268.699l73.857-29.82 73.858 29.82z"/><circle style="opacity:.1;enable-background:new" cx="256.001" cy="210.298" r="128.461"/><path style="fill:#f9be00" d="M329.859 235.188H182.144v268.699l73.857-29.82 73.858 29.82z"/><path style="fill:#fff" d="M231.024 235.188v248.963l24.977-10.084 24.978 10.084V235.188z"/><circle style="fill:#b88c1d" cx="256.001" cy="187.818" r="121.224"/><circle style="opacity:.15;enable-background:new" cx="256.001" cy="187.818" r="82.918"/><path style="opacity:.1;enable-background:new" d="M256.001 104.898c-45.795 0-82.919 37.126-82.919 82.923 0 45.796 37.124 82.921 82.919 82.921s82.919-37.126 82.919-82.921c.001-45.797-37.124-82.923-82.919-82.923zm0 149.19c-36.599 0-66.268-29.67-66.268-66.268 0-36.6 29.669-66.269 66.268-66.269s66.266 29.67 66.266 66.269c0 36.598-29.666 66.268-66.266 66.268z"/><path d="M229.328 219.397c-1.613-1.383-2.997-3.802-2.997-6.337 0-4.609 3.918-8.528 8.528-8.528 2.535 0 4.263 1.037 5.646 2.19 4.609 3.918 9.449 5.992 15.787 5.992 6.682 0 11.408-3.802 11.408-9.794v-.23c0-6.569-5.878-10.255-15.787-10.255h-2.766c-4.148 0-7.605-3.457-7.605-7.605 0-2.42 1.036-4.495 3.802-7.26l15.671-15.787h-24.774c-4.149 0-7.606-3.456-7.606-7.605 0-4.149 3.457-7.605 7.606-7.605h39.293c5.187 0 8.988 2.997 8.988 7.835 0 4.379-2.073 6.799-5.301 9.91l-15.785 15.095c10.947 1.844 21.663 7.605 21.663 22.585v.23c0 15.211-11.063 26.389-29.038 26.389-11.523-.001-20.165-3.575-26.733-9.22z"/><path style="fill:#1e252b" d="m449.106 151.943-20.043-17.816c-17.09-15.189-35.424-46.944-40.034-69.34l-5.406-26.266c-2.88-13.994-10.974-25.457-22.79-32.28-11.815-6.822-25.79-8.1-39.351-3.598l-25.45 8.451c-21.7 7.206-58.366 7.206-80.067 0l-25.45-8.45c-13.559-4.502-27.533-3.225-39.35 3.597-11.816 6.823-19.911 18.286-22.792 32.28l-5.405 26.266c-4.611 22.396-22.943 54.149-40.033 69.34l-20.044 17.816c-10.678 9.492-16.56 22.233-16.56 35.877s5.881 26.386 16.56 35.877l20.044 17.815c17.09 15.19 35.423 46.945 40.033 69.34l5.406 26.267c4.745 23.051 23.545 38.321 45.658 38.508v128.26a8.112 8.112 0 0 0 11.151 7.522l70.82-28.595 70.821 28.595a8.113 8.113 0 0 0 11.151-7.523V375.623c22.102-.199 40.912-15.486 45.65-38.505l5.406-26.266c4.611-22.396 22.944-54.151 40.034-69.341l20.043-17.815c10.678-9.492 16.56-22.233 16.56-35.877-.002-13.644-5.884-26.384-16.562-35.876zm-127.36 339.918-62.707-25.318a8.101 8.101 0 0 0-6.075 0l-62.706 25.318v-192.7c19.277 11.427 41.757 17.999 65.744 17.999s46.467-6.572 65.744-17.999v192.7zm-65.745-190.929c-62.37 0-113.112-50.742-113.112-113.112 0-62.371 50.742-113.113 113.112-113.113s113.113 50.742 113.113 113.113-50.742 113.112-113.113 113.112zm182.325-89.363-20.043 17.815c-19.605 17.426-39.859 52.505-45.147 78.197l-5.406 26.266c-3.116 15.137-15.346 25.241-29.758 25.527V287.79c28.901-23.74 47.368-59.738 47.368-99.97 0-71.318-58.021-129.34-129.339-129.34-71.317 0-129.338 58.021-129.338 129.34 0 40.232 18.467 76.231 47.368 99.97v71.582c-14.415-.282-26.644-10.371-29.763-25.526l-5.406-26.267c-5.289-25.692-25.541-60.77-45.146-78.197l-20.044-17.816c-7.167-6.37-11.113-14.803-11.113-23.748s3.946-17.379 11.113-23.748l20.044-17.816c19.605-17.426 39.858-52.505 45.147-78.197l5.405-26.266c1.934-9.391 7.265-17.026 15.012-21.499 7.748-4.471 17.024-5.272 26.123-2.25l25.45 8.451c24.896 8.267 65.4 8.267 90.293 0l25.45-8.451c9.101-3.02 18.377-2.223 26.124 2.251 7.747 4.472 13.078 12.107 15.011 21.498l5.406 26.267c5.289 25.692 25.542 60.771 45.147 78.196l20.043 17.816c7.166 6.37 11.112 14.803 11.112 23.748 0 8.948-3.947 17.381-11.113 23.751zm-109.12-77.872-13.041 9.656c9.578 12.938 14.642 28.314 14.642 44.466 0 41.249-33.559 74.808-74.806 74.808-41.248 0-74.806-33.559-74.806-74.808s33.558-74.809 74.806-74.809c16.66 0 32.426 5.358 45.592 15.494l9.898-12.858c-16.029-12.34-35.216-18.863-55.49-18.863-50.196 0-91.033 40.838-91.033 91.036 0 50.197 40.837 91.035 91.033 91.035s91.033-40.838 91.033-91.035c.001-19.653-6.163-38.368-17.828-54.122z"/><circle style="fill:#fff" cx="315.802" cy="130.376" r="18.886"/></svg>',
};

export function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN");
}

export function getBadgeClass(name: string): string {
  return badgeStyles[name] || "badge-default";
}

export function getBadgeIcon(name: string): string {
  return badgeIcons[name] || "<svg>...</svg>"; // Default SVG or empty
}
