export const dimensionMeta: Record<string, { name: string; model: string }> = {
  S1: { name: 'S1 职场自我认知', model: '自我认知' },
  S2: { name: 'S2 工作价值观', model: '自我认知' },
  S3: { name: 'S3 职业驱动力', model: '自我认知' },
  E1: { name: 'E1 打工安全感', model: '情感模式' },
  E2: { name: 'E2 工作投入度', model: '情感模式' },
  E3: { name: 'E3 边界意识', model: '情感模式' },
  A1: { name: 'A1 向上管理', model: '协作风格' },
  A2: { name: 'A2 平级协作', model: '协作风格' },
  A3: { name: 'A3 抗压能力', model: '协作风格' },
  Ac1: { name: 'Ac1 执行力', model: '行动模式' },
  Ac2: { name: 'Ac2 决策风格', model: '行动模式' },
  Ac3: { name: 'Ac3 时间感知', model: '行动模式' },
  So1: { name: 'So1 职场社交', model: '社交属性' },
  So2: { name: 'So2 政治嗅觉', model: '社交属性' },
  So3: { name: 'So3 真实指数', model: '社交属性' },
};

export const dimensionOrder = ['S1','S2','S3','E1','E2','E3','A1','A2','A3','Ac1','Ac2','Ac3','So1','So2','So3'];

export interface Option {
  label: string;
  value: number;
}

export interface Question {
  id: string;
  dim?: string;
  text: string;
  options: Option[];
  special?: boolean;
  kind?: string;
}

export const questions: Question[] = [
  // S1 职场自我认知
  { id: 'q1', dim: 'S1', text: '年终述职 begins，你心里在想：', options: [
    { label: '我这一年到底干了啥？HR会不会发现我啥都没做？', value: 1 },
    { label: '还行吧，把重点包装一下，应该能糊弄过去。', value: 2 },
    { label: '我的价值被严重低估了，PPT已经准备好证据。', value: 3 }
  ]},
  { id: 'q2', dim: 'S1', text: '同事在群里发："这个方案我做了很久，非常用心"，你的反应是：', options: [
    { label: '我上周也交了方案，但没人理我，是不是我不够用心？', value: 1 },
    { label: '挺好的，但和我有什么关系？', value: 2 },
    { label: '就这？我做的比他好多了，只是不想显摆。', value: 3 }
  ]},
  { id: 'q3', dim: 'S2', text: '工资到账短信来了，你的第一反应是：', options: [
    { label: '这数字是来侮辱我的吧？我是不是该跳槽了？', value: 1 },
    { label: '意料之中，够交房租就行，还要啥自行车。', value: 2 },
    { label: '还行，但我的市场价应该更高，下次谈判有底气了。', value: 3 }
  ]},
  { id: 'q4', dim: 'S2', text: '朋友问你"工作图啥"，你会说：', options: [
    { label: '图啥？图不被饿死呗，别跟我谈理想。', value: 1 },
    { label: '钱和意义各一半，没有钱提不起劲，但没有意义也空虚。', value: 2 },
    { label: '我在做一件有意义的事，顺便把钱赚了，完美。', value: 3 }
  ]},
  { id: 'q5', dim: 'S3', text: '周末阳光明媚，老板突然发消息："这个项目周一要交"，你会：', options: [
    { label: '假装没看见，周一再说，周末属于我自己。', value: 1 },
    { label: '看一眼，如果真的紧急就处理一下。', value: 2 },
    { label: '立刻打开电脑，这是我的战场，周末算什么！', value: 3 }
  ]},
  { id: 'q6', dim: 'S3', text: '说到职业规划，你的真实状态是：', options: [
    { label: '规划个鬼，35岁被裁了再说，及时行乐。', value: 1 },
    { label: '有个大概方向，但走一步看一步吧，想太远没用。', value: 2 },
    { label: '未来三年我要到哪个位置，我想得非常清楚。', value: 3 }
  ]},

  // E1 打工安全感
  { id: 'q7', dim: 'E1', text: '老板突然在群里@你："在吗？"，你的第一反应是：', options: [
    { label: '完了完了，是不是我捅篓子了？我最近做啥了？', value: 1 },
    { label: '派任务吧，等他说完再看，反正我不主动认领。', value: 2 },
    { label: '正好有事找他，主动送上门了，缘分啊。', value: 3 }
  ]},
  { id: 'q8', dim: 'E1', text: '公司群里突然发了一条"请各部门自查近期工作"，你会：', options: [
    { label: '已经开始刷简历了，这次轮到我了是吧？', value: 1 },
    { label: '观望一下，等官方消息再说，别自己吓自己。', value: 2 },
    { label: '无所谓，不是我的锅，查也查不出问题。', value: 3 }
  ]},
  { id: 'q9', dim: 'E2', text: '周三下午三点，你突然不想工作了，你会：', options: [
    { label: '刷手机摸鱼到下班，反正也没人管我。', value: 1 },
    { label: '站起来走走，喝杯咖啡续续命，熬到下班。', value: 2 },
    { label: '反思一下是不是目标设定有问题，然后继续干活。', value: 3 }
  ]},
  { id: 'q10', dim: 'E2', text: '你发现项目里有个大坑，但没人提，你会：', options: [
    { label: '又不是我挖的，关我什么事，别出头。', value: 1 },
    { label: '汇报一下，让决策者知道，让领导决定怎么办。', value: 2 },
    { label: '这坑不填迟早要爆，我来！体现我价值的时候到了。', value: 3 }
  ]},
  { id: 'q11', dim: 'E3', text: '周五下午六点，你正准备下班，同事发来消息："有个文件急等"，你会：', options: [
    { label: '周一见，周末不要找我，这是基本礼仪。', value: 1 },
    { label: '看一下，如果真的紧急就处理一下，职业素养还是要有。', value: 2 },
    { label: '立刻处理，工作第一，其他事都可以等。', value: 3 }
  ]},
  { id: 'q12', dim: 'E3', text: '你正在度假，老板发来消息："有个紧急情况"，你会：', options: [
    { label: '关机，或者回复"信号不好，先挂了"。', value: 1 },
    { label: '看一眼，能远程解决就处理，不想撕破脸。', value: 2 },
    { label: '订最早的机票回去，这种时候不表现什么时候表现？', value: 3 }
  ]},

  // A1 向上管理
  { id: 'q13', dim: 'A1', text: '老板布置了一个你觉得是馊主意的任务，你会：', options: [
    { label: '嘴上：好的老板。心里：这人脑子有问题吧。', value: 1 },
    { label: '委婉提出疑虑："这个方向我有一点点不同的想法……"', value: 2 },
    { label: '直接说不行，给出专业理由，老板也得讲道理。', value: 3 }
  ]},
  { id: 'q14', dim: 'A1', text: '你出差三天回来，第一件事是：', options: [
    { label: '先整理行李休息一下，工作回来再说，又不是急事。', value: 1 },
    { label: '给老板发个消息简要汇报，等他安排时间再聊。', value: 2 },
    { label: '立刻约老板面聊，当面汇报行程和结果，请示下一步。', value: 3 }
  ]},
  { id: 'q15', dim: 'A2', text: '会议上同事公开反驳你的方案，说"你这个有问题"，你：', options: [
    { label: '忍着，会后发消息给他："你行你来啊。"', value: 1 },
    { label: '让他说完，采纳合理的部分，没必要当场翻脸。', value: 2 },
    { label: '当场辩论，必须说清楚谁对谁错，我有数据我有底气。', value: 3 }
  ]},
  { id: 'q16', dim: 'A2', text: '跨部门合作，对方一直不配合你的需求，你：', options: [
    { label: '告状给双方老板，让老板们去协调，我不陪你玩。', value: 1 },
    { label: '主动约对方喝杯咖啡，当面聊聊，找个双方都能接受的方案。', value: 2 },
    { label: '算了他不配合我，我就自己干，反正我也会，欠他什么？', value: 3 }
  ]},
  { id: 'q17', dim: 'A3', text: '老板在全员大会上说了一个你认为是错误的方向，你：', options: [
    { label: '内心翻白眼，但表面点头称是，谁敢当众拆台啊。', value: 1 },
    { label: '会后私下找老板聊，不让他公开难堪，给足面子。', value: 2 },
    { label: '当场举手提问："老板，关于这个方案我有个问题想确认……"（用问题让他自己发现漏洞）', value: 3 }
  ]},
  { id: 'q18', dim: 'A3', text: '季度复盘会上，老板当众说："这个项目失败你责任很大"，你：', options: [
    { label: '想立刻辞职，或者找个地缝钻进去，当众被骂太丢人了。', value: 1 },
    { label: '低头认了，会后再找老板单独聊，私下解释清楚。', value: 2 },
    { label: '当场拿出数据复盘，说明客观原因，责任不全在我。', value: 3 }
  ]},

  // Ac1 执行力
  { id: 'q19', dim: 'Ac1', text: '周三下午老板突然给你一个周五要交的紧急任务，你会：', options: [
    { label: '先放着，周四周五再说，deadline是第一生产力。', value: 1 },
    { label: '尽快开始，争取周五前完成，不影响其他工作就行。', value: 2 },
    { label: '立刻放下手头所有事，通宵也要周三搞定，不睡觉也要干完。', value: 3 }
  ]},
  { id: 'q20', dim: 'Ac1', text: '你的工作邮箱积压着多少封未读邮件？', options: [
    { label: '200+封，我选择性忽略，反正没人一封封查。', value: 1 },
    { label: '几十封，看重要的回，不重要的就让它沉下去。', value: 2 },
    { label: '尽量保持零未读，每封都处理，这是我的职业素养。', value: 3 }
  ]},
  { id: 'q21', dim: 'Ac2', text: '同时收到老板、客服、客户三个地方的消息，都要你处理，你：', options: [
    { label: '哪个先催我我做哪个，其他就糊弄一下算了。', value: 1 },
    { label: '按紧急程度排序，客服>老板>客户，一个个来。', value: 2 },
    { label: '我能并行处理，同时开搞，效率就是这么高。', value: 3 }
  ]},
  { id: 'q22', dim: 'Ac2', text: '老板说"这个任务很急，越快越好"，你会：', options: [
    { label: '先放一边，等老板催再说，反正他说急也不一定真急。', value: 1 },
    { label: '尽快做，但不影响其他工作节奏，稳中求进。', value: 2 },
    { label: '放下一切先做这个，老板说急就是真急，不能等。', value: 3 }
  ]},
  { id: 'q23', dim: 'Ac3', text: '周一早上你坐到工位上，第一个小时通常在：', options: [
    { label: '吃早餐、回消息、看热搜，感觉没干什么就中午了。', value: 1 },
    { label: '看看邮件，看看日程，有紧急的处理一下。', value: 2 },
    { label: '列今日计划，按优先级排好，颗粒度精确到半小时。', value: 3 }
  ]},
  { id: 'q24', dim: 'Ac3', text: '你对加班的真实态度是：', options: [
    { label: '加班费给多少？给不够别想让我加班，我的时间不是免费的。', value: 1 },
    { label: '紧急情况可以加，但不能常态化，身体是革命的本钱。', value: 2 },
    { label: '加班是能力的证明，说明老板信任我，我愿意。', value: 3 }
  ]},

  // So1 职场社交
  { id: 'q25', dim: 'So1', text: '午餐时间，你的选择是：', options: [
    { label: '点外卖回工位，边吃边看剧，不打扰任何人，自己最舒服。', value: 1 },
    { label: '看情况，有人约就去，没人就在工位，不强求。', value: 2 },
    { label: '必须和同事一起，这是每日社交必修课，午餐社交是职场生存法则。', value: 3 }
  ]},
  { id: 'q26', dim: 'So1', text: '公司组织周末团建，要求全员参加，你的反应是：', options: [
    { label: '装病，或者找借口推掉，周末是我自己的时间。', value: 1 },
    { label: '去一下也行，但待一会就撤，不想玩太晚。', value: 2 },
    { label: '必须去！这是和同事增进感情的好机会，必须刷存在感！', value: 3 }
  ]},
  { id: 'q27', dim: 'So2', text: '茶水间两个人在低声聊天，看到你来了突然不说了，你会：', options: [
    { label: '心里翻白眼：肯定在说我，但无所谓，爱说说去。', value: 1 },
    { label: '假装没看到，拿了水就走，不给自己加戏。', value: 2 },
    { label: '回去立刻打听，肯定有什么八卦是我不知道的。', value: 3 }
  ]},
  { id: 'q28', dim: 'So2', text: '你发现老板连续三天对某个同事态度特别好，你的反应是：', options: [
    { label: '开始研究这个同事有什么背景，或者是不是要升职了。', value: 1 },
    { label: '无所谓，可能只是巧合，每个人的工作方式不同。', value: 2 },
    { label: '不管，与我工作无关，我只关心我自己的事。', value: 3 }
  ]},
  { id: 'q29', dim: 'So3', text: '你在朋友圈发工作相关内容的目的是：', options: [
    { label: '工作的事不给朋友圈看，谁知道有没有竞争对手或老板在看。', value: 1 },
    { label: '偶尔转发公司宣传内容，给老板看的，维护职业形象。', value: 2 },
    { label: '经常发，精心打造我的专业职场形象，这是个人品牌建设。', value: 3 }
  ]},
  { id: 'q30', dim: 'So3', text: '年终总结里你会怎么写自己的缺点？', options: [
    { label: '"太拼了，工作太认真"——经典套话，反正也没人当真。', value: 1 },
    { label: '说一个真实但无伤大雅的缺点，显得真诚但不扣分。', value: 2 },
    { label: '不写或者写"暂无"，我的缺点凭什么让他们知道？', value: 3 }
  ]},
];

export const specialQuestions: Question[] = [
  { id: 'drink_gate_q1', special: true, kind: 'drink_gate', text: '你做这个测试的真实原因是？', options: [
    { label: '纯好奇，就想知道自己是哪种打工人。', value: 1 },
    { label: '最近工作有点迷茫，想找点方向。', value: 2 },
    { label: '在摸鱼，反正闲着也是闲着。', value: 3 },
    { label: '刚被裁，想看看自己是什么类型的韭菜。', value: 4 }
  ]},
  { id: 'drink_gate_q2', special: true, kind: 'drink_trigger', text: '你目前的工作状态是？', options: [
    { label: '在职，但随时想跑。', value: 1 },
    { label: '刚入职或者准备换工作。', value: 2 }
  ]},
];

export const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2';

export interface TypeEntry {
  code: string;
  image?: string;
  cn: string;
  intro: string;
  desc: string;
}

export const TYPE_LIBRARY: Record<string, TypeEntry> = {
  "LATE": { code: "LATE", image: "/types/LATE.png", cn: "卷王附体", intro: "这个点下班？不可能的。", desc: `恭喜你，你就是传说中的卷王附体。你对加班的理解超越了大多数人，你不是在上班，你是在修仙。别人下班你加班，别人周末你加班，别人晋升你还是加班。你的工位就是你的家，你的电脑就是你的爱人。卷王的结局只有两个：要么卷到高层，要么卷进医院。` },
  "Mr.Know": { code: "Mr.Know", image: "/types/mr.know.png", cn: "职场懂王", intro: "这个问题我来回答一下。", desc: `恭喜你，你是办公室里最愿意分享知识的那个人。你的职场信条是：我不说你们永远不懂。你的会议发言永远比老板还长，你的朋友圈永远在转发行业分析。你不是不懂，是太懂了，懂到别人已经不想听你懂了。` },
  "MAX": { code: "MAX", image: "/types/max.png", cn: "KPI超标侠", intro: "这个月KPI？提前完成了。", desc: `恭喜你，你是KPI的奴隶，也是KPI的主人。你的人生字典里没有"不够"，只有"超额"。老板定的目标你嫌低，自己给自己加码是你的日常。但夜深人静的时候，你也会想：我这么拼，到底是为了什么？为了下一个KPI。` },
  "NIT": { code: "NIT", image: "/types/nit.png", cn: "完美主义社畜", intro: "这个PPT第五遍了，还是不够好。", desc: `恭喜你，你是办公室里的完美主义战士。你对细节的追求已经超越了工作的需要，一份文档你能调三遍格式，一个配色你能换十次。你最大的痛苦不是做不好，是别人觉得你做得太慢。但说实话，你自己也不知道什么时候该停下来。` },
  "FLIP": { code: "FLIP", image: "/types/FLIP.png", cn: "反复横跳侠", intro: "这个方案推翻了，我们重来。", desc: `恭喜你，你是职场不确定性大师。你的工作状态永远在推翻重来，上午定的方向下午就变，昨天确认的方案今天就改。你不是在工作，你是在进行一场名为"换个方向"的持续运动。老板已经习惯了你的一变再变，学会了等你自然稳定再验收。` },
  "ALL": { code: "ALL", image: "/types/ALL.png", cn: "全能打工人", intro: "写代码？做PPT？谈客户？都我来。", desc: `恭喜你，你就是那个一个人撑起整个部门的人。别人只会一样，你会三样；别人下班了，你还在。你是公司最离不开的人，也是最廉价的人。全能打工人，你的工资配不上你的能力，你的领导看不见你的付出。` },
  "FOMO": { code: "FOMO", image: "/types/FOMO.png", cn: "职场焦虑症", intro: "老板发消息了，是不是我又出问题了？", desc: `恭喜你，你是职场焦虑本虑。你对老板的消息过敏，你对话术变更敏感，你对会议邀请惊恐。别人上班是赚钱，你上班是渡劫。你的人生一半在睡觉，一半在想工作，真正的工作反而没干多少。焦虑症晚期，但老板觉得你工作态度有问题。` },
  "MASK": { code: "MASK", image: "/types/mask.png", cn: "职场人设狂", intro: "我在职场是温柔可靠的职场姐姐。", desc: `恭喜你，你是职场变色龙。你在老板面前是一个样子，在同事面前是另一个样子，在客户面前又是第三个样子。你的人设比你的工作能力更丰富，你的演技比你的专业度更精湛。职场人设狂魔，最终会迷失在各种人设里，不知道哪个才是真正的自己。` },
  "CALM": { code: "CALM", image: "/types/calm.png", cn: "职场清流", intro: "我不参与这些破事。", desc: `恭喜你，你是办公室里的佛系存在。你不争不抢，不站队不八卦，你觉得那些搞关系的都是傻子。你以为自己是出淤泥而不染，其实只是你在逃避。职场清流的下场往往是：被当成空气，或者被淤泥吞掉。` },
  "WHY": { code: "WHY", image: "/types/why.png", cn: "职场哲学家", intro: "所以，工作的意义到底是什么？", desc: `恭喜你，你是职场尼采。你每天不是在工作，是在思考工作的意义。你可以在开会的时候神游物外，思考人类为什么要上班。你对KPI的理解已经超越了数字，上升到了存在主义的高度。别人在干活，你在思考为什么要干活。哲学家型的员工，老板又爱又恨——爱你的深度，恨你的飘忽。` },
  "EASY": { code: "EASY", image: "/types/easy.png", cn: "摸鱼大师", intro: "我就看看网页，不干别的。", desc: `恭喜你，你是摸鱼界的传奇。你的电脑永远开着工作文档，你的眼睛永远盯着与工作无关的内容。你是"看起来很忙"这门艺术的集大成者。摸鱼大师的境界是：摸了半天鱼，老板还觉得你很忙。但，摸鱼一时爽，一直摸鱼一直爽吗？` },
  "EYES": { code: "EYES", image: "/types/eyes.png", cn: "监控狂魔", intro: "老板今天看我的眼神不对。", desc: `恭喜你，你是职场洞察力的极端。你对办公室政治的理解已经超越了常人，你能在老板咳嗽一声就知道他要骂人。但这种敏感也把你累得半死——别人上班是工作，你上班是读空气。监控狂魔的下场：看到了太多，看清了太少。` },
  "GHOST": { code: "GHOST", image: "/types/ghost.png", cn: "隐形大佬", intro: "我就一普通员工，没什么野心。", desc: `恭喜你，你是职场扫地僧。表面上你是个普通员工，实际上你家可能有十套房或者有个好爹。你的银行卡余额比你说的多，你的工作热情比你表现的低。隐形大佬的痛：低调太久，连自己都信了。` },
  "SHOW": { code: "SHOW", image: "/types/show.png", cn: "卷性能手", intro: "我下班早？我只是效率高而已。", desc: `恭喜你，你是效率婊。你的工位干净得像没人坐过，你的待办清得像没接过任务，你的日程空得像不饱和。卷性能手，你不是在工作，你是在表演工作。你用四两拨千斤的方式，让所有人觉得你很轻松——但只有你自己知道，你花了多少心思在"看起来很轻松"这件事上。` },
  "WEAVE": { code: "WEAVE", image: "/types/weave.png", cn: "PPT纺织工", intro: "这个动画要柔和，这个配色要专业。", desc: `恭喜你，你是PPT纺织工。你的工作内容不是完成业务，是把业务装进一个漂亮的壳子里。你的PPT有32种字体，48种配色方案，64种动画效果。但说实话，内容一页就够写完的东西，你用了三十页。PPT纺织工的命运：永远在纺织，永远不被看见。` },
  "OLD": { code: "OLD", image: "/types/old.png", cn: "职场老油条", intro: "我知道了，这个明天再说。", desc: `恭喜你，你是职场生存大师。你的技能不是工作能力，是"如何在职场优雅地不干活"。你知道每一件事的边界在哪里，你知道每一个老板的底线在哪里。老油条的信条：不是我的活不接，不是我的锅不背。你的每一天都在用力地"少干点"，精疲程度超过所有人。` },
  "SPIN": { code: "SPIN", image: "/types/spin.png", cn: "汇报艺术家", intro: "这个季度的成果主要是……", desc: `恭喜你，你是汇报艺术家。你的工作能力不一定最强，但你的汇报能力一定最顶级。你能把一个星期的摸鱼说成两周的攻坚，你能把失败的项目说成"大胆的尝试"。汇报艺术家的人生真理：干得好不如说得好。但常在河边走，哪有不湿鞋？` },
  "ZEN": { code: "ZEN", image: "/types/zen.png", cn: "佛系打工人", intro: "涨薪？随缘吧。", desc: `恭喜你，你是职场躺平协会会员。你不争不抢，不急不燥，老板夸你无所谓，老板骂你也无所谓。你的人生哲学是：地球离了谁都转，我的班上了就到了。佛系打工人的内心独白：不是不想争，是争也争不过，算了吧。` },
  "TREND": { code: "TREND", image: "/types/trend.png", cn: "职场网红粉", intro: "那个博主说这样汇报最有效！", desc: `恭喜你，你是职场知识付费的忠实用户。你关注了47个职场博主，你的收藏夹比你的大脑更有知识。你学过的课比你看过的书多，你记过的笔记比你做过的事多。职场网红粉的悲剧：买课如山倒，做事如抽丝。` },
  "PANIC": { code: "PANIC", image: "/types/panic.png", cn: "职场焦虑制造机", intro: "完了完了，这个没做过怎么办？", desc: `恭喜你，你是职场焦虑发生器。你对任何新任务的第一反应永远是恐惧，你觉得每一个困难都能要了你的命。你在做事之前就开始焦虑，你在焦虑之中忘了做事。焦虑制造机，你的情绪是部门里最贵的成本，因为大家都要花时间安抚你。` },
  "JILL": { code: "JILL", image: "/types/JILL.png", cn: "职场多面手", intro: "我同时在推进七个项目。", desc: `恭喜你，你是职场多线程处理器。你同时开很多个窗口，同时聊很多个群，同时推进很多个项目。你的一天是别人的三天，你的注意力是别人的十分之一。但多面手的诅咒：每一面都沾一点，每一面都不精。` },
  "DRIFT": { code: "DRIFT", image: "/types/DRIFT.jpeg", cn: "职场流浪汉", intro: "我就看看机会，不急着换。", desc: `恭喜你，你是职场流浪汉。你永远在招聘网站闲逛，你永远在看新机会，但你就永远不迈出那一步。你的简历更新了47版，你的面试参加了0场。职场流浪汉的人生：看遍所有机会，却一个都不属于我。` },
  "POOR": { code: "POOR", image: "/types/POOR.png", cn: "穷忙族", intro: "我这么忙工资还是这么点。", desc: `恭喜你，你是穷忙族的代言人。你的工资涨幅永远赶不上你的工作量，你的付出永远换不回等量的回报。你是公司里最忙的人，也是最穷的人。穷忙族的财务状态：工资月月光，加班天天有，卡债永远在。` },
  "PRO": { code: "PRO", image: "/types/PRO.jpeg", cn: "专业人士", intro: "这个应该走那个流程。", desc: `恭喜你，你是流程的守护者，规则的忠实粉丝。你说话中英混杂，"这个应该走那个workflow"——你的存在让整个公司的流程越来越复杂，也让你的存在感越来越低。专业人士的悲剧：别人觉得你在秀英语，其实你只是在说流程。` },
};

export const NORMAL_TYPES = [
  { code: "LATE", pattern: "HHH-HHH-HHM-HHH-HMM" },
  { code: "Mr.Know", pattern: "HMM-HMM-MMM-MMM-HMM" },
  { code: "MAX", pattern: "HHH-HHH-HHH-HHH-HMM" },
  { code: "NIT", pattern: "MMM-HHL-LML-LLH-LHM" },
  { code: "FLIP", pattern: "HMM-MLL-MMM-LLL-MMM" },
  { code: "ALL", pattern: "HHH-HHH-HHH-HHH-LMM" },
  { code: "FOMO", pattern: "LML-LLL-LLL-LLL-LML" },
  { code: "MASK", pattern: "MMM-MMM-MHH-HMM-HHL" },
  { code: "CALM", pattern: "HML-HLL-LLL-LMH-LLH" },
  { code: "WHY", pattern: "MML-LLL-LLL-LLL-MMM" },
  { code: "EASY", pattern: "MML-LLL-LMM-MML-LLL" },
  { code: "EYES", pattern: "MML-MMM-LMH-HHH-HHH" },
  { code: "GHOST", pattern: "HLL-LLL-LLL-LLL-LLH" },
  { code: "SHOW", pattern: "HHH-HHH-HHH-HHH-HHM" },
  { code: "WEAVE", pattern: "MMM-MMM-MLL-LLL-LMM" },
  { code: "OLD", pattern: "HHL-LLH-HHH-LMH-HHH" },
  { code: "SPIN", pattern: "HML-LLL-LMH-LML-HHH" },
  { code: "ZEN", pattern: "MHL-HLL-LLL-LLM-LLM" },
  { code: "TREND", pattern: "MMM-MLL-LMM-LLL-MMM" },
  { code: "PANIC", pattern: "LML-LLL-LLL-LLL-LLL" },
  { code: "JILL", pattern: "MMM-MMM-MMH-LLL-HMM" },
  { code: "DRIFT", pattern: "LML-LLL-LLL-LLL-LLL" },
  { code: "POOR", pattern: "LLL-LHH-LLL-LLL-LLL" },
  { code: "PRO", pattern: "MHH-HMM-MHH-HHH-LMH" },
];

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  S1: { L: `你对自己的职场能力持怀疑态度，每次述职都觉得自己在欺骗老板。`, M: `你觉得自己还行，但也不确定是不是真的行。`, H: `你相信自己的能力，虽然老板可能不这么认为。` },
  S2: { L: `你来上班就是为了钱，别跟我谈什么理想使命。`, M: `工资是基础，但工作最好还有点意义。`, H: `我在做一件有价值的事，钱只是顺带的。` },
  S3: { L: `上班的动力是下个月房租，不上班会饿死。`, M: `有点内在动力，但主要还是现实压力。`, H: `我是真的想做成一件事，不是为了钱。` },
  E1: { L: `每天上班都担心被裁，邮件提示音都能吓一跳。`, M: `有点安全感，但也不敢完全放松。`, H: `我为公司创造价值，我不担心这个问题。` },
  E2: { L: `上班能摸则摸，下班一秒都不想多待。`, M: `工作时间内认真干，但不想多干。`, H: `工作是我生活的一部分，我愿意投入。` },
  E3: { L: `我的时间是我的，下班了找我必须付加班费。`, M: `看情况，紧急的事会帮，但有底线。`, H: `工作需要就帮，大家都是同事嘛。` },
  A1: { L: `老板说的都对，反正我也不打算改变什么。`, M: `适当表达意见，但不会正面冲突。`, H: `我会直接沟通，我认为对的事我会坚持。` },
  A2: { L: `同事不配合我就告状，或者自己干了算。`, M: `尽量协商，实在不行再想别的办法。`, H: `合作共赢，我愿意多做一点换和谐。` },
  A3: { L: `被当众批评会想辞职，或者想找个地缝钻。`, M: `会难过，但会调整心态继续干。`, H: `对事不对人，我会解释清楚或者接受意见。` },
  Ac1: { L: `Deadline是第一生产力，不到最后一刻不动。`, M: `尽快开始，争取按时交就行。`, H: `立即行动，我喜欢提前完成。` },
  Ac2: { L: `同时来很多事就焦虑，哪个都做不好。`, M: `按重要性排序，一个个来。`, H: `我能同时处理多个任务，效率很高。` },
  Ac3: { L: `一天下来好像没干什么就下班了。`, M: `有忙有闲，整体还行。`, H: `我的时间颗粒度很细，每分钟都在工作。` },
  So1: { L: `午餐自己吃，不想花时间社交。`, M: `看情况，有人约就一起，不约就自己。`, H: `职场社交很重要，我主动经营关系。` },
  So2: { L: `办公室政治太复杂，我看不懂也不想参与。`, M: `能看出一部分，但不想主动趟浑水。`, H: `我很清楚谁是谁的人，局势尽在掌握。` },
  So3: { L: `朋友圈从不发工作相关内容，谁也别想知道我做什么。`, M: `偶尔转发公司宣传内容。`, H: `我的职场形象是精心经营的，展现我的专业度。` },
};
