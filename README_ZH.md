# FlowForge

> **FlowForge 分支** — 本仓库是 [tt-a1i/archify](https://github.com/tt-a1i/archify)（MIT）的分支，把重点从代码库转向**业务流程**：对话输入，输出经过校验的 BPMN 2.0 流程图。上游技术绘图引擎原样保留。署名见 [`NOTICE.md`](NOTICE.md)。

**把一次关于业务实际运作方式的对话，变成一张鲜活、可校验的 BPMN 2.0 流程图。**

FlowForge 会就一个流程向你提问——参与者、触发条件、上一次实际运行、决策点、异常、交接——然后把类型化 JSON IR 编译成自包含、确定性的交互式 HTML 产物。使用标准 BPMN 2.0 记号：开始/中间/结束事件、互斥/包含/并行网关、类型化任务、泳池与泳道、顺序流与消息流。

![version badge](https://img.shields.io/badge/version-2.16.0--dev.0-0891b2?style=flat-square)

**当前开发版本：** `v2.16.0-dev.0`。

- **先发现、后绘制** —— 代理提问，你来说，图随之出现。渲染前必须先逐条确认。
- **每次交互都有依据** —— 搜索、聚焦、上下游可达、精确路由、引导故事；绝不杜撰拓扑。
- **带回执的校验** —— BPMN 良构性加完整产物门禁：9/9 检查、0 错误、0 警告。
- **单文件，即交付** —— 自包含 HTML，另含 PNG、SVG、WebM 和 1200×630 分享卡片，明暗主题。
- **流程版本对比** —— `flowforge compare bpmn v1.json v2.json` 输出精确的新增/删除/变更/改道事实。
- **随附 Lenny 技能** —— `vendor/lenny-skills/`（76 技能，MIT）为发现式访谈提供参考。

## 快速开始

```bash
git clone <your-fork> && cd flowforge
./install.sh        # macOS / Linux
./install.ps1       # Windows
```

Raven 属于代理切换器之外的手动 ZIP 安装：把 `flowforge.zip` 解压到 `~/.raven/workspace/skills`，得到 `~/.raven/workspace/skills/flowforge`。

然后告诉你的代理：

```text
Map our order-to-cash process.
```

直接试用 CLI：

```bash
cd flowforge
npm install
node bin/flowforge.mjs doctor
node bin/flowforge.mjs render bpmn examples/order-return.bpmn.json examples/order-return.bpmn-rendered.html --quality showcase
node bin/flowforge.mjs compare bpmn examples/order-to-cash.bpmn.json examples/order-to-cash-v2.bpmn.json examples/order-to-cash-delta.html --json
```

## 图表类型

| 类型 | 用途 |
|---|---|
| `bpmn` | **业务流程** —— 审批、交接、订单到现金、入职、事故处理（主类型） |
| `journey` | 客户旅程与服务蓝图 |
| `infoflow` | 信息/文档流与血缘 |
| `stakeholder-map` | 谁重要、彼此如何关联 |
| `capability` | 运营模型：团队、能力、系统 |
| `okr-tree`、`north-star`、`growth-loop`、`launch-plan`、`feedback-pipeline` | 规划/增长画布 |
| `architecture`、`workflow`、`sequence`、`dataflow`、`lifecycle` | 继承自上游的技术图 |

## 不支持（有意为之）

- BPMN 执行/仿真引擎、BPMN-XML 导入导出
- 可视化拖拽编辑器
- 非英语界面
- 代码库分析（这是上游 Archify 的职责）
- 托管服务或数据库

## 署名与许可

[MIT](LICENSE)。FlowForge 是 tt-a1i 所著 [Archify](https://github.com/tt-a1i/archify)（MIT）的分支，后者基于 Cocoon-AI/architecture-diagram-generator（MIT）。Refound AI 的 Lenny's Product Skills v2.0（MIT）随附于 `vendor/lenny-skills/`。见 [`NOTICE.md`](NOTICE.md)。