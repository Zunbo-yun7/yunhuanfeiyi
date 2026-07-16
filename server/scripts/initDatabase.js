import fetch from "node-fetch";
import pool from "../config/db.js";
import { uploadImage } from "../services/imageUpload.js";

const IMGBED_API_KEY = "5205f5e3849dce2b9f88fe0700ce0fbd";

const initData = {
    home: {
        hero: {
            title: "云焕非遗",
            subtitle: "英歌文化数字展示平台",
            description: "走进普宁英歌，感受非遗魅力",
            backgroundImage:
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20Yingge%20dance%20performance%20with%20red%20costumes%20and%20masks%20dynamic%20movement%20cultural%20heritage&image_size=landscape_16_9",
            videoUrl: "",
        },
        projectIntro: "",
    },
    about: {
        introduction:
            "英歌舞是流传于广东省普宁市等地的一种传统民间舞蹈，被誉为中国汉族舞蹈史上的活化石，是国家级非物质文化遗产。英歌舞融合了武术、舞蹈、戏剧等多种艺术形式，以其刚劲有力的动作和独特的表演风格而闻名于世。",
        history: [
            {
                year: "明代",
                event: "英歌舞起源于广东普宁，距今已有400多年历史",
            },
            { year: "清代", event: "英歌舞在潮汕地区广泛传播，形成多个流派" },
            {
                year: "民国",
                event: "英歌舞发展鼎盛，成为潮汕地区重要的民俗活动",
            },
            { year: "现代", event: "英歌舞被列入国家级非物质文化遗产名录" },
        ],
        features: [
            {
                title: "刚劲有力的舞姿",
                description:
                    "英歌舞动作刚劲有力，充满阳刚之气，展现了中国传统武术的精髓。舞者手持双槌，配合鼓点节奏，做出各种勇猛有力的动作。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20performance%20with%20wooden%20sticks%20dynamic%20masculine%20movement%20Chinese%20traditional%20art&image_size=portrait_4_3",
            },
            {
                title: "独特的音乐伴奏",
                description:
                    "英歌舞配有专门的打击乐曲，锣、鼓、钹等乐器齐鸣，节奏强烈，气势恢宏，营造出热烈激昂的氛围。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20Chinese%20drums%20and%20gongs%20instrument%20music%20performance%20cultural&image_size=portrait_4_3",
            },
            {
                title: "精美的脸谱装扮",
                description:
                    "英歌队员们戴着精美的脸谱面具，扮演《水浒传》中的英雄人物，脸谱色彩丰富，造型独特，极具艺术价值。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20opera%20mask%20colorful%20Yingge%20dance%20face%20paint%20traditional%20art&image_size=portrait_4_3",
            },
            {
                title: "丰富的文化内涵",
                description:
                    "英歌舞不仅是一种舞蹈形式，更是中国传统文化的重要载体，蕴含着深厚的历史文化底蕴和民族精神。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20culture%20heritage%20performance%20art%20festival%20celebration&image_size=portrait_4_3",
            },
        ],
        puningFeatures: [
            {
                title: "历史悠久",
                description: "普宁英歌起源于明代，已有400多年的历史传承",
            },
            {
                title: "流派众多",
                description: "普宁英歌有多种流派，各具特色，精彩纷呈",
            },
            {
                title: "技艺精湛",
                description: "普宁英歌队员技艺高超，动作刚劲有力，气势磅礴",
            },
            {
                title: "文化符号",
                description: "普宁英歌已成为普宁乃至潮汕地区的文化名片",
            },
        ],
    },
    xintan: {
        village: {
            name: "新坛村",
            description:
                "新坛村位于广东省普宁市流沙东街道，是一个历史悠久、文化底蕴深厚的村落。这里是普宁英歌的重要发源地之一，新坛英歌队更是享誉海内外。",
            history:
                "新坛村始建于明代，村民多为陈姓。自清代以来，英歌舞在新坛村代代相传，形成了独特的表演风格。新坛英歌队曾多次代表普宁参加各类文化交流活动，深受好评。",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20traditional%20village%20architecture%20ancient%20houses%20Puning%20Guangdong%20cultural%20heritage&image_size=landscape_4_3",
        },
        team: {
            name: "新坛英歌队",
            founded: "1953年",
            description:
                "新坛英歌队成立于1953年，是普宁英歌的杰出代表。经过数十年的发展，新坛英歌队已成为一支技艺精湛、风格独特的表演队伍。",
            achievements: [
                "多次获得省级以上文艺汇演奖项",
                "曾赴香港、澳门等地演出",
                "多次参与国家级文化交流活动",
            ],
            images: [
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20team%20group%20photo%20red%20costumes%20masks%20performance%20Chinese%20traditional&image_size=portrait_4_3",
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20performance%20stage%20traditional%20Chinese%20culture%20festival&image_size=portrait_4_3",
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20parade%20street%20celebration%20crowd%20Chinese%20traditional%20festival&image_size=portrait_4_3",
            ],
        },
        training: {
            description:
                "新坛英歌队注重人才培养，设有专门的训练基地，吸引了众多年轻人加入。队员们利用业余时间刻苦训练，传承和发扬英歌文化。",
            images: [
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20training%20practice%20young%20performers%20wooden%20sticks%20Chinese%20traditional&image_size=portrait_4_3",
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20basic%20training%20kung%20fu%20martial%20arts%20practice%20outdoor&image_size=portrait_4_3",
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20team%20training%20morning%20exercise%20discipline%20Chinese%20traditional&image_size=portrait_4_3",
            ],
        },
        stories: [
            {
                title: "祖孙三代的英歌情",
                content:
                    "陈老先生一家三代都是英歌队员，从爷爷辈开始，英歌就成为了这个家庭最重要的文化传承。如今，孙子也加入了英歌队，继续着这份家族的热爱。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20family%20generations%20traditional%20culture%20heritage%20grandfather%20father%20son&image_size=portrait_4_3",
            },
            {
                title: "青春力量注入传统",
                content:
                    "近年来，越来越多的年轻人加入新坛英歌队，他们为这支传统队伍注入了新的活力。年轻队员们不仅传承了传统技艺，还结合现代元素进行创新。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20people%20Yingge%20dance%20passionate%20performance%20cultural%20heritage&image_size=portrait_4_3",
            },
            {
                title: "走向世界的英歌",
                content:
                    "新坛英歌队曾多次赴海外演出，将中国传统英歌文化带到了世界各地。每一次演出都赢得了当地观众的热烈掌声和高度评价。",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20international%20performance%20stage%20world%20cultural%20exchange&image_size=portrait_4_3",
            },
        ],
    },
    actions: {
        introduction:
            "英歌舞有许多经典动作，每个动作都有其独特的含义和技巧。这些动作来源于武术和戏曲，经过长期的发展演变，形成了英歌独特的表演风格。",
        actions: [
            {
                name: "洗马",
                pinyin: "Xi Ma",
                description:
                    "模仿古代将士洗马的动作，双手持槌，身体左右摇摆，步伐稳健有力。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20movement%20washing%20horse%20pose%20wooden%20sticks%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "展现将士的豪迈气概",
            },
            {
                name: "抛槌",
                pinyin: "Pao Chui",
                description:
                    "将双槌抛向空中，然后稳稳接住，动作惊险刺激，需要极高的技巧。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20throwing%20sticks%20acrobatic%20movement%20dynamic%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "展示英歌队员的高超技艺",
            },
            {
                name: "交叉",
                pinyin: "Jiao Cha",
                description: "双槌在身前交叉舞动，动作快速有力，节奏感强。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20cross%20sticks%20movement%20synchronized%20performance%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "象征团结协作的精神",
            },
            {
                name: "对打",
                pinyin: "Dui Da",
                description:
                    "两名队员面对面进行对打表演，模拟古代战场的战斗场景，动作逼真激烈。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20duel%20two%20performers%20sticks%20fight%20dynamic%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "展现英雄的英勇无畏",
            },
            {
                name: "飞跃",
                pinyin: "Fei Yue",
                description:
                    "队员高高跃起，在空中做出各种优美的动作，展现英歌的动感与美感。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20flying%20leap%20acrobatics%20dynamic%20movement%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "象征积极向上的精神",
            },
            {
                name: "盘龙",
                pinyin: "Pan Long",
                description:
                    "多名队员围成一圈，旋转舞动，如同盘龙一般，气势恢宏。",
                videoUrl: "",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20dragon%20formation%20circular%20movement%20team%20performance%20Chinese%20traditional&image_size=portrait_4_3",
                meaning: "象征团结和力量",
            },
        ],
    },
    equipment: {
        categories: [
            { id: 1, name: "脸谱" },
            { id: 2, name: "服装" },
            { id: 3, name: "道具" },
        ],
        items: [
            {
                category_id: 1,
                name: "程咬金",
                description: "绿色脸谱，代表勇猛鲁莽的性格",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20mask%20Cheng%20Yaojin%20green%20color%20Chinese%20traditional%20opera%20face&image_size=portrait_4_3",
                details:
                    "程咬金是《水浒传》中的重要人物，以其勇猛无畏的性格著称。绿色脸谱通常代表勇猛、暴躁的性格特征。",
            },
            {
                category_id: 1,
                name: "秦琼",
                description: "黄色脸谱，代表忠诚勇敢",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20mask%20Qin%20Qiong%20yellow%20color%20Chinese%20traditional%20opera%20face&image_size=portrait_4_3",
                details:
                    "秦琼是唐代名将，也是《水浒传》中的英雄人物。黄色脸谱象征着忠诚、勇敢的品质。",
            },
            {
                category_id: 1,
                name: "尉迟恭",
                description: "黑色脸谱，代表刚正不阿",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20mask%20Yuchi%20Gong%20black%20color%20Chinese%20traditional%20opera%20face&image_size=portrait_4_3",
                details:
                    "尉迟恭是唐代著名将领，以其刚正不阿的性格闻名。黑色脸谱通常代表正直、勇猛的人物。",
            },
            {
                category_id: 1,
                name: "鲁智深",
                description: "蓝色脸谱，代表豪爽仗义",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20mask%20Lu%20Zhishen%20blue%20color%20Chinese%20traditional%20opera%20face&image_size=portrait_4_3",
                details:
                    "鲁智深是《水浒传》中的经典人物，以其豪爽仗义的性格深受人们喜爱。蓝色脸谱代表豪爽、勇猛的性格。",
            },
            {
                category_id: 2,
                name: "战衣",
                description: "红色为主的传统战衣",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20costume%20red%20traditional%20Chinese%20warrior%20robe&image_size=portrait_4_3",
                details:
                    "英歌队员穿着的战衣以红色为主，象征着英勇无畏的精神。战衣设计精美，装饰华丽。",
            },
            {
                category_id: 2,
                name: "战靴",
                description: "黑色高筒战靴",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20boots%20black%20traditional%20Chinese%20warrior%20footwear&image_size=portrait_4_3",
                details:
                    "黑色高筒战靴是英歌队员的标准装备，既保护脚部，又增添了威武的气势。",
            },
            {
                category_id: 2,
                name: "腰带",
                description: "金色宽腰带",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20belt%20gold%20traditional%20Chinese%20warrior%20accessory&image_size=portrait_4_3",
                details:
                    "金色宽腰带不仅是装饰，更是英歌表演中的重要道具，配合动作展现力量之美。",
            },
            {
                category_id: 3,
                name: "双槌",
                description: "木质表演双槌",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20wooden%20sticks%20hammers%20traditional%20Chinese%20performance%20prop&image_size=portrait_4_3",
                details:
                    "双槌是英歌表演最核心的道具，通常由硬木制成，敲击时发出清脆的声响。",
            },
            {
                category_id: 3,
                name: "大鼓",
                description: "大型战鼓",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20drum%20large%20traditional%20Chinese%20percussion%20instrument&image_size=portrait_4_3",
                details:
                    "大鼓是英歌伴奏的核心乐器，鼓声雄浑有力，指挥着整个表演的节奏。",
            },
            {
                category_id: 3,
                name: "铜锣",
                description: "青铜大锣",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20gong%20bronze%20traditional%20Chinese%20percussion%20instrument&image_size=portrait_4_3",
                details:
                    "铜锣声音洪亮，穿透力强，是英歌表演中不可或缺的伴奏乐器。",
            },
            {
                category_id: 3,
                name: "海螺",
                description: "海螺号角",
                image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yingge%20dance%20conch%20shell%20horn%20traditional%20Chinese%20instrument&image_size=portrait_4_3",
                details:
                    "海螺号角声音独特，常用于表演开始和高潮部分，增添了神秘的氛围。",
            },
        ],
    },
    people: {
        introduction:
            "英歌文化的传承离不开一代又一代传承人的努力。他们用毕生的精力守护着这份珍贵的文化遗产，让英歌艺术得以延续和发展。",
        categories: [
            {
                title: "国家级传承人",
                description: "获得国家级非物质文化遗产传承人名誉的英歌大师",
            },
            {
                title: "省级传承人",
                description: "获得省级非物质文化遗产传承人名誉的英歌专家",
            },
            {
                title: "青年传承人",
                description: "新一代英歌传承者，肩负着传承和创新的使命",
            },
        ],
        people: [
            {
                category_id: 1,
                name: "陈英辉",
                role: "国家级非物质文化遗产传承人",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20Chinese%20man%20Yingge%20dance%20master%20portrait%20traditional%20culture&image_size=portrait_4_3",
                story: "陈英辉大师是普宁英歌的杰出代表，从少年时期开始学习英歌，至今已有60多年的表演经验。他不仅技艺精湛，更致力于英歌文化的传承和推广，培养了大批优秀的英歌队员。",
                achievements: [
                    "国家级非物质文化遗产传承人",
                    "广东省民间文化杰出传承人",
                    "多次获得省级以上文艺奖项",
                ],
            },
            {
                category_id: 1,
                name: "李炳炎",
                role: "国家级非物质文化遗产传承人",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=senior%20Chinese%20man%20Yingge%20dance%20expert%20portrait%20traditional%20arts&image_size=portrait_4_3",
                story: "李炳炎大师出生于英歌世家，自幼跟随父辈学习英歌。他精通多种英歌流派，尤其擅长脸谱绘制和动作编排，为英歌文化的发展做出了重要贡献。",
                achievements: [
                    "国家级非物质文化遗产传承人",
                    "潮汕文化名人",
                    "英歌脸谱艺术大师",
                ],
            },
            {
                category_id: 2,
                name: "张锦雄",
                role: "省级非物质文化遗产传承人",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20Chinese%20man%20Yingge%20dance%20coach%20portrait%20professional&image_size=portrait_4_3",
                story: "张锦雄是新坛英歌队的主教练，从事英歌教学工作30余年。他注重培养年轻队员，将传统英歌技艺与现代教学方法相结合，取得了显著成效。",
                achievements: [
                    "广东省非物质文化遗产传承人",
                    "普宁市英歌协会副会长",
                    "多次带领队伍获得省级奖项",
                ],
            },
            {
                category_id: 2,
                name: "王秋生",
                role: "省级非物质文化遗产传承人",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20Chinese%20man%20Yingge%20dance%20instructor%20portrait%20traditional&image_size=portrait_4_3",
                story: "王秋生是泥沟英歌队的核心成员，擅长英歌的阵法编排和音乐创作。他创作的多个英歌节目在省级比赛中获奖，为英歌艺术的创新发展做出了贡献。",
                achievements: [
                    "广东省非物质文化遗产传承人",
                    "揭阳市优秀民间艺人",
                    "英歌节目创作奖",
                ],
            },
            {
                category_id: 3,
                name: "陈明轩",
                role: "青年英歌队员",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20boy%20Yingge%20dance%20performer%20portrait%20talented&image_size=portrait_4_3",
                story: "陈明轩从小热爱英歌，10岁开始学习，如今已是新坛英歌队的骨干队员。他不仅继承了传统技艺，还积极参与英歌文化的推广活动，是新一代传承人的优秀代表。",
                achievements: [
                    "广东省青少年才艺大赛一等奖",
                    "普宁英歌新秀奖",
                    "多次参与大型演出",
                ],
            },
            {
                category_id: 3,
                name: "林小雨",
                role: "青年英歌队员",
                avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20Chinese%20girl%20Yingge%20dance%20performer%20portrait%20talented&image_size=portrait_4_3",
                story: "林小雨是近年来涌现的优秀女英歌队员，她打破了传统观念的束缚，成为英歌队中的一道亮丽风景线。她的表演刚柔并济，深受观众喜爱。",
                achievements: [
                    "揭阳市青年英歌比赛金奖",
                    "普宁英歌最佳新人奖",
                    "网络人气奖",
                ],
            },
        ],
    },
};

async function downloadImage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Failed to download: ${response.status}`);
        return await response.buffer();
    } catch (error) {
        console.error(`Error downloading image: ${url}`, error);
        return null;
    }
}

async function processAndUploadImage(url, fileName) {
    if (!url || !url.startsWith("http")) return url;

    const buffer = await downloadImage(url);
    if (!buffer) return url;

    const result = await uploadImage(buffer, fileName);
    return result.success ? result.url : url;
}

async function initDatabase() {
    console.log("开始初始化数据库...");

    try {
        console.log("\n1. 初始化首页数据...");
        const homeBgImage = await processAndUploadImage(
            initData.home.hero.backgroundImage,
            "home_hero_bg.jpg",
        );
        await pool.query(
            "INSERT INTO home_data (hero_title, hero_subtitle, hero_description, hero_background_image, hero_video_url, project_intro) VALUES (?, ?, ?, ?, ?, ?)",
            [
                initData.home.hero.title,
                initData.home.hero.subtitle,
                initData.home.hero.description,
                homeBgImage,
                initData.home.hero.videoUrl,
                initData.home.projectIntro,
            ],
        );
        console.log("首页数据初始化完成");

        console.log("\n2. 初始化关于英歌数据...");
        await pool.query("INSERT INTO about_data (introduction) VALUES (?)", [
            initData.about.introduction,
        ]);

        for (let i = 0; i < initData.about.history.length; i++) {
            const item = initData.about.history[i];
            await pool.query(
                "INSERT INTO about_history (year, event, sort_order) VALUES (?, ?, ?)",
                [item.year, item.event, i],
            );
        }
        console.log("历史数据初始化完成");

        for (let i = 0; i < initData.about.features.length; i++) {
            const item = initData.about.features[i];
            const imageUrl = await processAndUploadImage(
                item.image,
                `about_feature_${i}.jpg`,
            );
            await pool.query(
                "INSERT INTO about_features (title, description, image, sort_order) VALUES (?, ?, ?, ?)",
                [item.title, item.description, imageUrl, i],
            );
        }
        console.log("特色数据初始化完成");

        for (let i = 0; i < initData.about.puningFeatures.length; i++) {
            const item = initData.about.puningFeatures[i];
            await pool.query(
                "INSERT INTO about_puning_features (title, description, sort_order) VALUES (?, ?, ?)",
                [item.title, item.description, i],
            );
        }
        console.log("普宁特色数据初始化完成");

        console.log("\n3. 初始化新坛英歌数据...");
        const villageImage = await processAndUploadImage(
            initData.xintan.village.image,
            "xintan_village.jpg",
        );
        await pool.query(
            "INSERT INTO xintan_village (name, description, history, image) VALUES (?, ?, ?, ?)",
            [
                initData.xintan.village.name,
                initData.xintan.village.description,
                initData.xintan.village.history,
                villageImage,
            ],
        );
        console.log("新坛村数据初始化完成");

        const teamImages = [];
        for (let i = 0; i < initData.xintan.team.images.length; i++) {
            const url = await processAndUploadImage(
                initData.xintan.team.images[i],
                `xintan_team_${i}.jpg`,
            );
            teamImages.push(url);
        }
        await pool.query(
            "INSERT INTO xintan_team (name, founded, description, images) VALUES (?, ?, ?, ?)",
            [
                initData.xintan.team.name,
                initData.xintan.team.founded,
                initData.xintan.team.description,
                JSON.stringify(teamImages),
            ],
        );
        console.log("新坛英歌队数据初始化完成");

        for (let i = 0; i < initData.xintan.team.achievements.length; i++) {
            await pool.query(
                "INSERT INTO xintan_team_achievements (content, sort_order) VALUES (?, ?)",
                [initData.xintan.team.achievements[i], i],
            );
        }
        console.log("成就数据初始化完成");

        const trainingImages = [];
        for (let i = 0; i < initData.xintan.training.images.length; i++) {
            const url = await processAndUploadImage(
                initData.xintan.training.images[i],
                `xintan_training_${i}.jpg`,
            );
            trainingImages.push(url);
        }
        await pool.query(
            "INSERT INTO xintan_training (description, images) VALUES (?, ?)",
            [
                initData.xintan.training.description,
                JSON.stringify(trainingImages),
            ],
        );
        console.log("训练数据初始化完成");

        for (let i = 0; i < initData.xintan.stories.length; i++) {
            const item = initData.xintan.stories[i];
            const imageUrl = await processAndUploadImage(
                item.image,
                `xintan_story_${i}.jpg`,
            );
            await pool.query(
                "INSERT INTO xintan_stories (title, content, image, sort_order) VALUES (?, ?, ?, ?)",
                [item.title, item.content, imageUrl, i],
            );
        }
        console.log("故事数据初始化完成");

        console.log("\n4. 初始化动作图谱数据...");
        await pool.query("INSERT INTO actions_data (introduction) VALUES (?)", [
            initData.actions.introduction,
        ]);

        for (let i = 0; i < initData.actions.actions.length; i++) {
            const item = initData.actions.actions[i];
            const imageUrl = await processAndUploadImage(
                item.image,
                `action_${i}.jpg`,
            );
            await pool.query(
                "INSERT INTO actions (name, pinyin, description, video_url, image, meaning, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    item.name,
                    item.pinyin,
                    item.description,
                    item.videoUrl,
                    imageUrl,
                    item.meaning,
                    i,
                ],
            );
        }
        console.log("动作数据初始化完成");

        console.log("\n5. 初始化装备数据...");
        for (let i = 0; i < initData.equipment.categories.length; i++) {
            const cat = initData.equipment.categories[i];
            await pool.query(
                "INSERT INTO equipment_categories (category, sort_order) VALUES (?, ?)",
                [cat.name, i],
            );
        }
        console.log("装备分类数据初始化完成");

        for (let i = 0; i < initData.equipment.items.length; i++) {
            const item = initData.equipment.items[i];
            const imageUrl = await processAndUploadImage(
                item.image,
                `equipment_${i}.jpg`,
            );
            await pool.query(
                "INSERT INTO equipment_items (category_id, name, description, image, details, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    item.category_id,
                    item.name,
                    item.description,
                    imageUrl,
                    item.details,
                    i,
                ],
            );
        }
        console.log("装备物品数据初始化完成");

        console.log("\n6. 初始化人物故事数据...");
        await pool.query("INSERT INTO people_data (introduction) VALUES (?)", [
            initData.people.introduction,
        ]);

        for (let i = 0; i < initData.people.categories.length; i++) {
            const cat = initData.people.categories[i];
            await pool.query(
                "INSERT INTO people_categories (title, description, sort_order) VALUES (?, ?, ?)",
                [cat.title, cat.description, i],
            );
        }
        console.log("人物分类数据初始化完成");

        for (let i = 0; i < initData.people.people.length; i++) {
            const item = initData.people.people[i];
            const avatarUrl = await processAndUploadImage(
                item.avatar,
                `person_${i}.jpg`,
            );
            await pool.query(
                "INSERT INTO people (category_id, name, role, avatar, story, achievements, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    item.category_id,
                    item.name,
                    item.role,
                    avatarUrl,
                    item.story,
                    JSON.stringify(item.achievements),
                    i,
                ],
            );
        }
        console.log("人物数据初始化完成");

        console.log("\n✅ 数据库初始化完成！");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ 数据库初始化失败:", error);
        process.exit(1);
    }
}

initDatabase();
