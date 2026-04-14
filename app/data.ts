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
  { id: 'q1', dim: 'S1', text: '周一早上闹钟响的时候，你的内心真实反应是？', options: [{ label: '装死，再睡五分钟。', value: 1 }, { label: '叹了口气，接受现实。', value: 2 }, { label: '居然有点期待今天的工作。', value: 3 }] },
  { id: 'q2', dim: 'S1', text: '你对自己的工作能力评价是？', options: [{ label: '说实话，我自己都替公司担心。', value: 1 }, { label: '还行吧，勉强能糊弄过去。', value: 2 }, { label: '我为公司创造的价值被严重低估了。', value: 3 }] },
  { id: 'q3', dim: 'S2', text: '你上班最核心的目的是？', options: [{ label: '纯粹为了那点工资，别跟我谈理想。', value: 1 }, { label: '工资+成长，各占一半吧。', value: 2 }, { label: '我在做一件有意义的事。', value: 3 }] },
  { id: 'q4', dim: 'S2', text: '看到工资条的时候，你通常的表情是？', options: [{ label: '这数字是认真的吗？', value: 1 }, { label: '意料之中，波澜不惊。', value: 2 }, { label: '我的价值终于被体现了！', value: 3 }] },
  { id: 'q5', dim: 'S3', text: '驱动你上班的最大动力是？', options: [{ label: '下个月房租，不能失业。', value: 1 }, { label: '同事还行，不上班也没事干。', value: 2 }, { label: '我真的想把这个项目做成。', value: 3 }] },
  { id: 'q6', dim: 'S3', text: '你对自己的职业发展有规划吗？', options: [{ label: '规划个屁，走一步看一步。', value: 1 }, { label: '有个大概方向，但很模糊。', value: 2 }, { label: '三年后我要到哪个位置，我想得很清楚。', value: 3 }] },

  // E1 打工安全感
  { id: 'q7', dim: 'E1', text: '老板突然把你叫进办公室，你的第一反应是？', options: [{ label: '完了，是不是要裁我了。', value: 1 }, { label: '应该是有什么任务要派吧。', value: 2 }, { label: '正好有事要找他，主动送上门了。', value: 3 }] },
  { id: 'q8', dim: 'E1', text: '公司传来裁员风声，你的反应是？', options: [{ label: '已经开始刷简历了。', value: 1 }, { label: '先观望一下，等官宣再说。', value: 2 }, { label: '不是我，先稳住。', value: 3 }] },
  { id: 'q9', dim: 'E2', text: '你在工作中的投入程度是？', options: [{ label: '上班能摸则摸，下班一秒都不想多待。', value: 1 }, { label: '工作时间内认真干，到点就走。', value: 2 }, { label: '上班是打工，下班想的是工作。', value: 3 }] },
  { id: 'q10', dim: 'E2', text: '发现一个工作问题，你会？', options: [{ label: '不是我的活，不归我管。', value: 1 }, { label: '顺手的话会说一下，不管也行。', value: 2 }, { label: '必须解决它，这是我的责任。', value: 3 }] },
  { id: 'q11', dim: 'E3', text: '同事在下班前五分钟找你帮忙做个东西，你的反应是？', options: [{ label: '下班了，明天再说。', value: 1 }, { label: '看内容，简单就帮，复杂就说来不及。', value: 2 }, { label: '没问题，我帮你。', value: 3 }] },
  { id: 'q12', dim: 'E3', text: '老板在周末发消息让你处理个事，你会？', options: [{ label: '周一看，已经周六了。', value: 1 }, { label: '先回一句"收到，周一处理"。', value: 2 }, { label: '立刻处理，工作是第一位。', value: 3 }] },

  // A1 向上管理
  { id: 'q13', dim: 'A1', text: '老板布置了一个你觉得不靠谱的任务，你的反应是？', options: [{ label: '嘴上好好好，心里已经开始骂。', value: 1 }, { label: '会适当表达一下疑虑，看他怎么说。', value: 2 }, { label: '直接说出我的不同意见。', value: 3 }] },
  { id: 'q14', dim: 'A1', text: '你向老板汇报工作的频率是？', options: [{ label: '他不找我我也不找他。', value: 1 }, { label: '做完了一个阶段性的再汇报。', value: 2 }, { label: '主动汇报进度，让他随时知道我在干嘛。', value: 3 }] },
  { id: 'q15', dim: 'A2', text: '同事在会议上公开反对你的方案，你？', options: [{ label: '会后一定要让他知道谁是对的。', value: 1 }, { label: '解释一下，采纳合理的部分。', value: 2 }, { label: '你说得对，按你说的来。', value: 3 }] },
  { id: 'q16', dim: 'A2', text: '跨部门合作时，你的风格是？', options: [{ label: '对方不配合我就告状给老板。', value: 1 }, { label: '尽量协商，实在不行再升级。', value: 2 }, { label: '对方舒服就行，我多干点没事。', value: 3 }] },
  { id: 'q17', dim: 'A3', text: '老板在公开场合说了一个你觉得不对的观点，你？', options: [{ label: '当面：您说得对。背后：这人懂个屁。', value: 1 }, { label: '私下找老板聊，不公开场合让他难堪。', value: 2 }, { label: '当场提出不同看法，对事不对人。', value: 3 }] },
  { id: 'q18', dim: 'A3', text: '被老板当众批评的时候，你？', options: [{ label: '想找个地缝钻进去，或者想辞职。', value: 1 }, { label: '先忍着，下来再复盘。', value: 2 }, { label: '觉得是误会就当场解释清楚。', value: 3 }] },

  // Ac1 执行力
  { id: 'q19', dim: 'Ac1', text: '你收到一个deadline很紧的任务，你会？', options: [{ label: '先拖两天，实在不行再加班。', value: 1 }, { label: '尽快开始，争取按时交就行。', value: 2 }, { label: '立刻开始加急处理，提前交。', value: 3 }] },
  { id: 'q20', dim: 'Ac1', text: '你收到一封有很多待办事项的邮件，你的反应是？', options: [{ label: '不回了，等对方再催。', value: 1 }, { label: '挑重要的回，其他假装没看见。', value: 2 }, { label: '逐条回复，一个不落。', value: 3 }] },
  { id: 'q21', dim: 'Ac2', text: '面对多个任务同时需要你处理，你会？', options: [{ label: '哪个催得急先做哪个，最后一起糊弄。', value: 1 }, { label: '按重要性排个序，一个个来。', value: 2 }, { label: '能同时处理几个，我效率很高。', value: 3 }] },
  { id: 'q22', dim: 'Ac2', text: '此题没有题目，请盲选', options: [{ label: '这道题选A？', value: 1 }, { label: '这道题选B？', value: 2 }, { label: '这道题选C？', value: 3 }] },
  { id: 'q23', dim: 'Ac3', text: '你的一天通常怎么度过的？', options: [{ label: '好像没干什么就下班了。', value: 1 }, { label: '有忙的时候也有摸鱼的时候。', value: 2 }, { label: '每一分钟都花在刀刃上。', value: 3 }] },
  { id: 'q24', dim: 'Ac3', text: '你对加班的态度是？', options: [{ label: '加班是不可能的，这辈子都不可能。', value: 1 }, { label: '紧急情况可以加，但不能常态化。', value: 2 }, { label: '加班是能力的证明，我愿意。', value: 3 }] },

  // So1 职场社交
  { id: 'q25', dim: 'So1', text: '你在公司午餐通常和谁吃？', options: [{ label: '自己点外卖，回工位吃。', value: 1 }, { label: '看情况，有人约就和，没人约就自己。', value: 2 }, { label: '必须和同事一起，这是社交时间。', value: 3 }] },
  { id: 'q26', dim: 'So1', text: '公司团建活动，你的态度是？', options: [{ label: '能不去就不去，比上班还累。', value: 1 }, { label: '看什么活动，有的可以参加。', value: 2 }, { label: '必须去，这是建立感情的好机会。', value: 3 }] },
  { id: 'q27', dim: 'So2', text: '你注意到老板最近对某同事态度特别好，你的反应是？', options: [{ label: '开始研究这个同事有什么门道。', value: 1 }, { label: '无所谓，可能只是巧合。', value: 2 }, { label: '没什么想法，工作归工作。', value: 3 }] },
  { id: 'q28', dim: 'So2', text: '部门里有人在背后说别人坏话，你会？', options: [{ label: '跟着一起说，不说显得我不合群。', value: 1 }, { label: '听听就行，不插嘴也不传播。', value: 2 }, { label: '找个借口走开，不想参与。', value: 3 }] },
  { id: 'q29', dim: 'So3', text: '你在朋友圈发工作相关内容的频率是？', options: [{ label: '我的朋友圈没有工作，谢谢。', value: 1 }, { label: '偶尔转发公司的宣传。', value: 2 }, { label: '经常发，展现我的职业形象。', value: 3 }] },
  { id: 'q30', dim: 'So3', text: '你愿意在简历上写"精通Excel"吗？', options: [{ label: '写，反正进去再说。', value: 1 }, { label: '写，因为我会基本操作。', value: 2 }, { label: '不写，我真的很精通。', value: 3 }] },
];

export const specialQuestions: Question[] = [
  { id: 'drink_gate_q1', special: true, kind: 'drink_gate', text: '你做这个测试的主要目的是？', options: [{ label: '纯好奇，看看自己是什么类型。', value: 1 }, { label: '最近工作有点迷茫，想找点方向。', value: 2 }, { label: '就是在摸鱼，打发时间。', value: 3 }, { label: '刚被裁，想看看自己是什么类型的打工人。', value: 4 }] },
  { id: 'drink_gate_q2', special: true, kind: 'drink_trigger', text: '你目前的工作状态是？', options: [{ label: '在职，但随时想跑。', value: 1 }, { label: '刚入职或者准备换工作。', value: 2 }] },
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
  "FLIP": { code: "FLIP", image: "/types/FLIP.jpeg", cn: "反复横跳侠", intro: "这个方案推翻了，我们重来。", desc: `恭喜你，你是职场不确定性大师。你的工作状态永远在推翻重来，上午定的方向下午就变，昨天确认的方案今天就改。你不是在工作，你是在进行一场名为"换个方向"的持续运动。老板已经习惯了你的一变再变，学会了等你自然稳定再验收。` },
  "ALL": { code: "ALL", image: "/types/ALL.png", cn: "全能打工人", intro: "写代码？做PPT？谈客户？都我来。", desc: `恭喜你，你就是那个一个人撑起整个部门的人。别人只会一样，你会三样；别人下班了，你还在。你是公司最离不开的人，也是最廉价的人。全能打工人，你的工资配不上你的能力，你的领导看不见你的付出。` },
  "FOMO": { code: "FOMO", image: "/types/FOMO.png", cn: "职场焦虑症", intro: "老板发消息了，是不是我又出问题了？", desc: `恭喜你，你是职场焦虑本虑。你对老板的消息过敏，你对话术变更敏感，你对会议邀请惊恐。别人上班是赚钱，你上班是渡劫。你的人生一半在睡觉，一半在想工作，真正的工作反而没干多少。焦虑症晚期，但老板觉得你工作态度有问题。` },
  "MASK": { code: "MASK", image: "https://media.c1aile.com/cf0ed4e4-99f9-4e6a-82f5-b840c8ebfb75", cn: "职场人设狂", intro: "我在职场是温柔可靠的职场姐姐。", desc: `恭喜你，你是职场变色龙。你在老板面前是一个样子，在同事面前是另一个样子，在客户面前又是第三个样子。你的人设比你的工作能力更丰富，你的演技比你的专业度更精湛。职场人设狂魔，最终会迷失在各种人设里，不知道哪个才是真正的自己。` },
  "CALM": { code: "CALM", image: "https://media.c1aile.com/c869a9f2-7cd3-48cc-82e1-adefda88ae29", cn: "职场清流", intro: "我不参与这些破事。", desc: `恭喜你，你是办公室里的佛系存在。你不争不抢，不站队不八卦，你觉得那些搞关系的都是傻子。你以为自己是出淤泥而不染，其实只是你在逃避。职场清流的下场往往是：被当成空气，或者被淤泥吞掉。` },
  "WHY": { code: "WHY", image: "https://media.c1aile.com/86545efc-55fa-4403-a5fd-448350578bfd", cn: "职场哲学家", intro: "所以，工作的意义到底是什么？", desc: `恭喜你，你是职场尼采。你每天不是在工作，是在思考工作的意义。你可以在开会的时候神游物外，思考人类为什么要上班。你对KPI的理解已经超越了数字，上升到了存在主义的高度。别人在干活，你在思考为什么要干活。哲学家型的员工，老板又爱又恨——爱你的深度，恨你的飘忽。` },
  "EASY": { code: "EASY", image: "https://media.c1aile.com/475df796-ddbd-4b88-b86c-2f49bb950006", cn: "摸鱼大师", intro: "我就看看网页，不干别的。", desc: `恭喜你，你是摸鱼界的传奇。你的电脑永远开着工作文档，你的眼睛永远盯着与工作无关的内容。你是"看起来很忙"这门艺术的集大成者。摸鱼大师的境界是：摸了半天鱼，老板还觉得你很忙。但，摸鱼一时爽，一直摸鱼一直爽吗？` },
  "EYES": { code: "EYES", image: "https://media.c1aile.com/12778cff-d39c-45d4-ab88-73389fcf25c3", cn: "监控狂魔", intro: "老板今天看我的眼神不对。", desc: `恭喜你，你是职场洞察力的极端。你对办公室政治的理解已经超越了常人，你能在老板咳嗽一声就知道他要骂人。但这种敏感也把你累得半死——别人上班是工作，你上班是读空气。监控狂魔的下场：看到了太多，看清了太少。` },
  "GHOST": { code: "GHOST", image: "https://media.c1aile.com/2dfe00c6-effe-4b1b-a497-117ad951ab47", cn: "隐形大佬", intro: "我就一普通员工，没什么野心。", desc: `恭喜你，你是职场扫地僧。表面上你是个普通员工，实际上你家可能有十套房或者有个好爹。你的银行卡余额比你说的多，你的工作热情比你表现的低。隐形大佬的痛：低调太久，连自己都信了。` },
  "SHOW": { code: "SHOW", image: "https://media.c1aile.com/366241dc-a5ee-49c2-bcb0-96449c813a45", cn: "卷性能手", intro: "我下班早？我只是效率高而已。", desc: `恭喜你，你是效率婊。你的工位干净得像没人坐过，你的待办清得像没接过任务，你的日程空得像不饱和。卷性能手，你不是在工作，你是在表演工作。你用四两拨千斤的方式，让所有人觉得你很轻松——但只有你自己知道，你花了多少心思在"看起来很轻松"这件事上。` },
  "WEAVE": { code: "WEAVE", image: "https://media.c1aile.com/21c1991b-4558-4186-8c06-68c46991c346", cn: "PPT纺织工", intro: "这个动画要柔和，这个配色要专业。", desc: `恭喜你，你是PPT纺织工。你的工作内容不是完成业务，是把业务装进一个漂亮的壳子里。你的PPT有32种字体，48种配色方案，64种动画效果。但说实话，内容一页就够写完的东西，你用了三十页。PPT纺织工的命运：永远在纺织，永远不被看见。` },
  "OLD": { code: "OLD", image: "https://media.c1aile.com/cbf4d556-371f-4d81-82b5-c35a70440233", cn: "职场老油条", intro: "我知道了，这个明天再说。", desc: `恭喜你，你是职场生存大师。你的技能不是工作能力，是"如何在职场优雅地不干活"。你知道每一件事的边界在哪里，你知道每一个老板的底线在哪里。老油条的信条：不是我的活不接，不是我的锅不背。你的每一天都在用力地"少干点"，精疲程度超过所有人。` },
  "SPIN": { code: "SPIN", image: "https://media.c1aile.com/6dec147c-6cf5-4267-9632-d0b447c045d7", cn: "汇报艺术家", intro: "这个季度的成果主要是……", desc: `恭喜你，你是汇报艺术家。你的工作能力不一定最强，但你的汇报能力一定最顶级。你能把一个星期的摸鱼说成两周的攻坚，你能把失败的项目说成"大胆的尝试"。汇报艺术家的人生真理：干得好不如说得好。但常在河边走，哪有不湿鞋？` },
  "ZEN": { code: "ZEN", image: "https://media.c1aile.com/3a923744-4ffb-42cc-a8e3-0980fd781525", cn: "佛系打工人", intro: "涨薪？随缘吧。", desc: `恭喜你，你是职场躺平协会会员。你不争不抢，不急不躁，老板夸你无所谓，老板骂你也无所谓。你的人生哲学是：地球离了谁都转，我的班上了就够了。佛系打工人的内心独白：不是不想争，是争也争不过，算了吧。` },
  "TREND": { code: "TREND", image: "https://media.c1aile.com/347a1f9e-63d8-4557-93d5-d00e28530823", cn: "职场网红粉", intro: "那个博主说这样汇报最有效！", desc: `恭喜你，你是职场知识付费的忠实用户。你关注了47个职场博主，你的收藏夹比你的大脑更有知识。你学过的课比你看过的书多，你记过的笔记比你做过的事多。职场网红粉的悲剧：买课如山倒，做事如抽丝。` },
  "PANIC": { code: "PANIC", image: "https://media.c1aile.com/a1499adf-c170-491c-ace4-3fc6f45ab11b", cn: "职场焦虑制造机", intro: "完了完了，这个没做过怎么办？", desc: `恭喜你，你是职场焦虑发生器。你对任何新任务的第一反应永远是恐惧，你觉得每一个困难都能要了你的命。你在做事之前就开始焦虑，你在焦虑之中忘了做事。焦虑制造机，你的情绪是部门里最贵的成本，因为大家都要花时间安抚你。` },
  "JILL": { code: "JILL", image: "https://media.c1aile.com/4221ecf5-cebf-4ffc-8eca-5926a45173af", cn: "职场多面手", intro: "我同时在推进七个项目。", desc: `恭喜你，你是职场多线程处理器。你同时开很多个窗口，同时聊很多个群，同时推进很多个项目。你的一天是别人的三天，你的注意力是别人的十分之一。但多面手的诅咒：每一面都沾一点，每一面都不精。` },
  "DRIFT": { code: "DRIFT", image: "https://media.c1aile.com/49a0d2d0-cfde-42e8-8c7c-ac0b92a7f33c", cn: "职场流浪汉", intro: "我就看看机会，不急着换。", desc: `恭喜你，你是职场流浪汉。你永远在招聘网站闲逛，你永远在看新机会，但你就永远不迈出那一步。你的简历更新了47版，你的面试参加了0场。职场流浪汉的人生：看遍所有机会，却一个都不属于我。` },
  "POOR": { code: "POOR", image: "https://media.c1aile.com/3d7327d9-c12b-4ae4-9ef3-58b7974c089c", cn: "穷忙族", intro: "我这么忙工资还是这么点。", desc: `恭喜你，你是穷忙族的代言人。你的工资涨幅永远赶不上你的工作量，你的付出永远换不回等量的回报。你是公司里最忙的人，也是最穷的人。穷忙族的财务状态：工资月月光，加班天天有，卡债永远在。` },
  "PRO": { code: "PRO", image: "https://media.c1aile.com/3d7327d9-c12b-4ae4-9ef3-58b7974c089c", cn: "专业人士", intro: "这个应该走那个流程。", desc: `恭喜你，你是流程的守护者，规则的忠实粉丝。你说话中英混杂，"这个应该走那个workflow"——你的存在让整个公司的流程越来越复杂，也让你的存在感越来越低。专业人士的悲剧：别人觉得你在秀英语，其实你只是在说流程。` },
  "SIMPLE": { code: "SIMPLE", image: "https://media.c1aile.com/2b2c9cf4-814f-45ac-b6db-a25cfc1f3ba3", cn: "傻乐打工人", intro: "哈哈哈哈，今天居然没加班！", desc: `恭喜你！由于你的职场回路过于清奇，标准人格库已无法定义你。HHHH型人格是系统为极其稀有的职场体验者保留的神秘人格。你不焦虑不纠结不内耗，你觉得上班就是上班，下班就是下班。别人在为KPI失眠，你在为看什么剧纠结。你的快乐是职场里最后的乌托邦。` },
};

export const NORMAL_TYPES = [
  { code: "LATE", pattern: "HHH-HMH-MHH-HHH-MHM" },
  { code: "Mr.Know", pattern: "HMH-HMH-MHH-HHH-LHL" },
  { code: "MAX", pattern: "HHH-HHM-HHH-HMH-MHL" },
  { code: "NIT", pattern: "MHM-MMH-MHM-HMH-LHL" },
  { code: "FLIP", pattern: "HHH-HMH-MMH-HHH-LHL" },
  { code: "ALL", pattern: "MHM-HMM-HHM-MMH-MHL" },
  { code: "FOMO", pattern: "HHL-LMH-LHH-HHM-LHL" },
  { code: "MASK", pattern: "HHM-HMH-MMH-HHH-MHM" },
  { code: "CALM", pattern: "HMH-HHL-HMM-HMM-HLH" },
  { code: "WHY", pattern: "MLH-LHL-HLH-MLM-MLH" },
  { code: "EASY", pattern: "MMH-MHL-HMM-LMM-HLL" },
  { code: "EYES", pattern: "HLM-MML-MLM-MLM-HLH" },
  { code: "GHOST", pattern: "MMH-MMM-HML-LMM-MML" },
  { code: "SHOW", pattern: "MLH-MHM-MLH-MLH-LMH" },
  { code: "WEAVE", pattern: "LLH-LHL-LML-LLL-MLM" },
  { code: "OLD", pattern: "HHL-HMH-MMH-HHM-LHH" },
  { code: "SPIN", pattern: "HHL-HMH-MLH-MHM-LHH" },
  { code: "ZEN", pattern: "HHL-HLH-LMM-HHM-LHH" },
  { code: "TREND", pattern: "MHL-MLH-LML-MML-LHM" },
  { code: "PANIC", pattern: "HHL-MLH-LMH-HHH-LHL" },
  { code: "JILL", pattern: "HHL-LLH-LLM-MML-LHM" },
  { code: "DRIFT", pattern: "LLM-LMM-LLL-LLL-MLM" },
  { code: "POOR", pattern: "LML-LLH-LHL-LML-LHM" },
  { code: "PRO", pattern: "MLL-LHL-LLM-MLL-HLH" },
  { code: "SIMPLE", pattern: "HHHH-HHHH" },
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
