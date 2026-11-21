// The closing chapter, after Schwager's "Market Wizard Lessons": traits that
// recur across the people in this book. Each person file tags its own lessons
// with one of these keys and says, in its own words, how the person showed it.

import type { Bi } from '@/lib/people-types';

export interface Lesson {
  key: string;
  title: Bi;
  body: Bi;
}

export const LESSONS: Lesson[] = [
  {
    key: 'important-problem',
    title: { en: 'Choose a problem that matters', zh: '选一个真正重要的问题' },
    body: {
      en: 'Richard Hamming asked his colleagues at Bell Labs what the most important problems in their field were, and then why they were not working on them. Almost everyone in this book could answer the first question early, and chose to work on the answer.',
      zh: '理查德·汉明在贝尔实验室常问同事：你们领域最重要的问题是什么？然后再问：你为什么不去做它？这本书里的人几乎都很早就能回答第一个问题，并且选择去做它。',
    },
  },
  {
    key: 'long-focus',
    title: { en: 'Stay with it for years', zh: '长期专注一个问题' },
    body: {
      en: 'Wiles worked on Fermat’s Last Theorem in near secrecy for seven years. McClintock spent decades on the genetics of maize. The work that lasts is rarely the work that was quick.',
      zh: '怀尔斯几乎秘密地做了七年费马大定理。麦克林托克花了几十年研究玉米的遗传。留得下来的工作，很少是做得快的工作。',
    },
  },
  {
    key: 'leave-mainstream',
    title: { en: 'Be willing to leave the consensus', zh: '敢于离开主流' },
    body: {
      en: 'Hinton kept working on neural networks through two periods when most of the field had given up on them. Leaving the consensus is not the same as being contrarian: the people here left because their own evidence pointed elsewhere.',
      zh: '在两次几乎整个领域都放弃神经网络的时期，辛顿一直没有停下。离开主流不等于唱反调：这里的人离开，是因为他们自己的证据指向别处。',
    },
  },
  {
    key: 'right-partner',
    title: { en: 'Find the right partner', zh: '找到对的合作者' },
    body: {
      en: 'Kahneman and Tversky worked by talking for hours every day, and often could not say afterwards whose idea was whose. The partnerships in this book are rarely between similar people. More often one partner supplied what the other lacked.',
      zh: '卡尼曼和特沃斯基每天一起聊上好几个小时，事后常常说不清一个想法是谁先提出的。这本书里的合作，很少发生在相似的人之间，更多是一方补上了另一方缺的东西。',
    },
  },
  {
    key: 'first-principles',
    title: { en: 'Simple tools, deep questions', zh: '用简单的工具想深的问题' },
    body: {
      en: 'Many of the ideas here look simple once stated: a game in which no player gains by changing strategy alone, a measure of information in bits. Getting to that simplicity took a willingness to start from the basics instead of the literature.',
      zh: '这里的很多想法一说出来就显得简单：没有人能单方面改变策略而得益的博弈，用比特来衡量的信息。可要做到这种简单，得愿意从最基本的地方想起，而不是从文献想起。',
    },
  },
  {
    key: 'curiosity',
    title: { en: 'Let curiosity lead', zh: '让好奇心带路' },
    body: {
      en: 'Feynman’s Nobel work began, by his own account, with watching a plate wobble in the Cornell cafeteria. Shannon built juggling machines. Play is not a distraction from serious work for these people; it is often where the serious work came from.',
      zh: '按费曼自己的说法，他获得诺贝尔奖的工作，起点是在康奈尔大学食堂里看一只盘子晃动。香农造过会抛球的机器。对这些人来说，玩不是正经工作的干扰，正经工作常常就是从玩里来的。',
    },
  },
  {
    key: 'persist-evidence',
    title: { en: 'Hold to the evidence when rejected', zh: '被拒绝时守住证据' },
    body: {
      en: 'Marshall drank a culture of Helicobacter pylori when no one believed bacteria caused ulcers. Shechtman kept his diffraction patterns when his group leader told him to leave. Persistence counts only when it rests on data.',
      zh: '没有人相信细菌能导致胃溃疡时，马歇尔喝下了一管幽门螺杆菌培养液。组长让谢赫特曼走人时，他守住了自己的衍射图。坚持只有建立在数据上才有意义。',
    },
  },
  {
    key: 'cross-field',
    title: { en: 'Carry tools across fields', zh: '把工具带到别的领域' },
    body: {
      en: 'Crick brought a physicist’s habits to biology. Simons brought mathematics to markets. Many breakthroughs in this book came from someone who knew a method that the field they entered had never tried.',
      zh: '克里克把物理学家的习惯带进了生物学，西蒙斯把数学带进了市场。这本书里不少突破，都来自一个人掌握了新领域从没试过的方法。',
    },
  },
  {
    key: 'craft',
    title: { en: 'Do the hands-on work yourself', zh: '亲手做' },
    body: {
      en: 'Cajal drew thousands of neurons by hand. Faraday built his own apparatus. Hodgkin spent years on a single crystal structure. Close contact with the material is where many of these people saw what others missed.',
      zh: '卡哈尔亲手画了成千上万个神经元。法拉第自己搭建实验装置。霍奇金为一个晶体结构花了好几年。很多人正是在亲手和材料打交道时，看到了别人没看到的东西。',
    },
  },
  {
    key: 'communicate',
    title: { en: 'Write and teach clearly', zh: '写清楚，讲明白' },
    body: {
      en: 'Darwin wrote the Origin for general readers, not only for naturalists. Knuth built a typesetting system because he cared how mathematics looked on the page. An idea that others can understand travels further than one that only its author can follow.',
      zh: '达尔文写《物种起源》时，读者设定的不只是博物学家，还有普通人。高德纳因为在意数学排在纸上好不好看，自己做了一套排版系统。别人能看懂的想法，比只有作者自己才懂的想法走得更远。',
    },
  },
];

export const LESSON_BY_KEY: Record<string, Lesson> = Object.fromEntries(LESSONS.map(l => [l.key, l]));
