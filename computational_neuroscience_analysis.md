# 计算神经科学领域学者分析框架

## 一、领域概述

计算神经科学（Computational Neuroscience）是一个跨学科领域，主要研究大脑如何通过神经网络处理信息。这个领域的学者通常来自以下背景：

| 子方向 | 典型方法 | 代表性问题 |
|--------|----------|-----------|
| **理论神经科学** | 数学建模、动力系统 | 神经编码、决策理论 |
| **计算建模** | 仿真、网络模型 | 突触可塑性、学习规则 |
| **认知计算** | 贝叶斯推断、强化学习 | 知觉、运动控制 |
| **神经网络理论** | 深度学习、RNN | AI与神经科学交叉 |
| **系统神经科学** | 大规模记录、解码 | 神经群体编码 |
| **方法/工具开发** | 软件、算法、平台 | 分析工具、可视化 |

---

## 二、领域标志性人物（基于公开学术知识）

### A. 奠基人/范式开创者

| 姓名 | 核心贡献 | 影响力类型 |
|------|----------|-----------|
| **David Marr** | 《Vision》视觉计算理论三层次 | 定义了整个领域的问题框架 |
| **John Hopfield** | Hopfield网络、能量函数 | 开创神经网络理论 |
| **Terrence Sejnowski** | Boltzmann机、ICA在神经科学应用 | 方法创新+组织能力 |
| **Christof Koch** | 意识的神经关联 | 定义问题 |
| **Geoffrey Hinton** | 深度学习与大脑学习的联系 | 跨AI-Neuro影响 |
| **Yann LeCun** | 卷积网络与视觉系统类比 | 跨领域 |
| **Karl Friston** | 自由能原理、SPM软件 | 理论+工具双重影响 |

### B. 当代领军人物（活跃研究者）

| 姓名 | 机构 | 研究方向 | 典型贡献 |
|------|------|----------|----------|
| **Konrad Kording** | UPenn | 贝叶斯运动控制、ML+Neuro | 多篇高引综述、跨学科推动 |
| **Xiao-Jing Wang** | NYU | 工作记忆、决策回路模型 | 环形吸引子模型 |
| **Surya Ganguli** | Stanford | 理论神经科学、深度学习理论 | 高维神经动力学 |
| **David Sussillo** | Google/Stanford | RNN、神经动力学 | 优化方法在RNN训练 |
| **Jonathan Pillow** | Princeton | 统计神经科学 | GLM在神经数据分析 |
| **Byron Yu** | CMU | 神经群体解码 | Gaussian Process Factor Analysis |
| **Maneesh Sahani** | Gatsby/UCL | 概率建模 | 变分推断在神经科学 |
| **Alexandre Bhui / Samuel Gershman** | Harvard | 计算认知 | 强化学习与认知 |
| **Anne Churchland** | UCLA | 决策神经科学 | 行为-神经关联 |
| **Eve Marder** | Brandeis | 中枢模式发生器 | 电路稳定性 |
| **Adrienne Bhui** | Harvard | 计算认知 | 决策与学习 |

### C. 方法/工具型大牛

| 姓名/团队 | 工具/方法 | 影响范围 |
|-----------|----------|----------|
| **Karl Friston** | SPM (Statistical Parametric Mapping) | fMRI分析标准 |
| **Nikolaus Kriegeskorte** | RSA (Representational Similarity Analysis) | 跨物种/跨模态比较 |
| **Joshua Vogelstein** | NeuroData工具链 | 大规模神经数据 |
| **Loren Frank / Leigh Hochberg** | 神经接口 | BCI应用 |

---

## 三、学术地位评估维度

### 维度1：影响力类型分类

```
"大牛"不是单一类型，而是以下几种之一或组合：

1. 理论开创者 - 提出新框架/范式
   信号：经典论文被广泛引用、教科书引用、综述引用

2. 方法发明者 - 开发被广泛使用的工具
   信号：工具GitHub star、引用工具的论文数、软件下载量

3. 问题定义者 - 创建新的研究方向或benchmark
   信号：启发后续大量论文、相关综述引用

4. 组织领袖 - 建设社区、培养学生
   信号：学生分布（学术谱系）、会议组织、中心建设
```

### 维度2：量化指标解读

| 指标 | 含义 | 注意事项 |
|------|------|----------|
| **总引用** | 历史累积影响 | 方法/工具型研究者天然高；老资格天然高 |
| **h-index** | 持续产出被引论文的能力 | 学科差异大（CS vs 生物） |
| **m-index** | h / 学术年龄 | 比较同代人更公平 |
| **近5年引用** | 当前活跃度 | 反映"现在是否仍重要" |
| **i10-index** | 多少篇论文超10次引用 | 产出广度 |

### 维度3：结构性认可信号

检查清单：

- [ ] 顶会 keynote / plenary / tutorial
- [ ] 期刊编委 / 副主编 / 主编
- [ ] 会议 Program Chair / Area Chair
- [ ] 学会会士 (IEEE Fellow, AIMBE Fellow 等)
- [ ] 重大奖项 (Brain Prize, Gruber, NYAS 等)
- [ ] 讲席教授 / Endowed Chair
- [ ] 培养的学生现分布情况

---

## 四、学术年龄与阶段判断

由于数据库通常不提供真实年龄，使用**首篇论文年份**作为代理：

```
学术年龄 = 当前年份 - 首篇论文年份

阶段划分：
- 早期 (0-10年): 建立独立研究方向
- 中期 (10-20年): 扩展影响、培养学生
- 资深 (20+年): 领域权威、塑造议程
```

### 各阶段"正常"指标参考（计算神经科学）

| 阶段 | 预期h-index | 预期总引用 | 典型角色 |
|------|-------------|-----------|----------|
| 早期 | 10-25 | 1,000-10,000 | 助理教授/博后 |
| 中期 | 25-50 | 10,000-50,000 | 副教授/教授 |
| 资深 | 50+ | 50,000+ | 讲席教授/院士 |

---

## 五、避免"引用幻觉"的方法

### 常见陷阱

1. **综述膨胀**：某些人主要靠综述获得引用
   - 检测：看一作/通讯作论文的引用占比

2. **工具挂名**：大型项目的工具论文署名众多
   - 检测：看独立工作的引用

3. **自引网络**：小圈子互相引用
   - 检测：查看引用来源的多样性

4. **领域热度**：热门领域自动带来引用
   - 检测：与同领域同阶段对比

### 更可靠的信号

1. **高引单篇的实质贡献**：是一作/通讯吗？
2. **被顶级同行引用**：被谁引用比引用数更重要
3. **思想传播**：概念/术语被采用
4. **学术谱系**：学生的成就

---

## 六、选导师/找合作的实用建议

### 如何用以上框架

1. **明确你的目标**
   - 想做理论？找"理论型"大牛
   - 想做工具？找"方法型"大牛
   - 想找工作？找学生就业率高的组

2. **查学术谱系**
   - [Academic Family Tree](https://academictree.org/)
   - [Neurotree](https://neurotree.org/)

3. **检查近期产出**
   - 近3年是否有持续产出？
   - 研究方向是否仍前沿？

4. **检查组的"健康度"**
   - 学生毕业去向
   - 博后流动情况
   - 合作网络活跃度

5. **实地考察**
   - 读他们最近3篇论文
   - 看学生的独立工作
   - 联系在组学生

---

## 七、数据来源与工具

| 数据源 | 优点 | 缺点 |
|--------|------|------|
| **Google Scholar** | 最全、最新 | 无法批量抓取 |
| **OpenAlex** | 开放API、免费 | 覆盖略有差异 |
| **Semantic Scholar** | AI增强、有API | 部分指标缺失 |
| **Web of Science** | 权威、可筛选 | 需要机构订阅 |
| **Scopus** | 索引全、有h-index | 需要订阅 |

### 推荐工作流

```
1. Google Scholar → 手动浏览，获取初始名单
2. OpenAlex API → 批量获取结构化数据
3. 个人主页/CV → 补充职位、奖项、学生信息
4. Neurotree → 查学术谱系
```

---

## 附录：关键期刊与会议

### 顶级期刊
- **Nature Neuroscience**
- **Neuron**
- **PLOS Computational Biology**
- **eLife**
- **Journal of Neuroscience**
- **Current Biology**

### 计算神经专业期刊
- **Neural Computation**
- **Journal of Computational Neuroscience**
- **Frontiers in Computational Neuroscience**

### 重要会议
- **COSYNE** (Computational and Systems Neuroscience)
- **SfN** (Society for Neuroscience)
- **NeurIPS** (交叉方向)
- **CCN** (Cognitive Computational Neuroscience)
