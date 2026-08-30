# FlowForge

一款能随业务流程变化而再生的流程图工具。

在代理对话中，把一句普通的中文流程描述，变成一张经过校验的 BPMN 2.0 流程图。用几句话描述订单到收款。FlowForge 会追问细节，逐条回读确认，然后编译出一份自包含的 HTML 图，可直接打开、分享或审计。

FlowForge 是 Archify（MIT）的分支，把重点从代码库转向业务流程。署名见 [NOTICE.md](NOTICE.md)。

## 为什么

流程图会过时。最了解流程的人往往没有画图工具，于是图靠手工画，每次审计都要重画，一个季度后就陈旧了。

FlowForge 从根源上解决：图由经过校验的数据源编译而来，而不是手绘。流程变化时，你描述变化，它重新生成。

## 你能得到什么

- BPMN 2.0 记号：事件、网关、类型化任务、泳池与泳道、顺序流与消息流。
- 先访谈、后作图：参与者、触发条件、上一次实际运行、决策点、异常、交接。你没有确认流程故事之前，不会渲染任何东西。
- 带回执的校验：9/9 项产物检查、0 错误、0 警告，否则不产出地图。
- 流程版本对比：对比两个版本，得到精确的新增、删除、变更与改道事实。
- 每份地图一个文件：自包含 HTML，含明暗主题，另有 PNG、SVG、WebM 与 1200x630 分享卡片。
- BPMN 之外的业务图类型：客户旅程、信息流、干系人图、能力图、OKR 树、北极星指标、增长环、发布计划、反馈管道。
- 继承自上游 Archify 的技术图：架构、工作流、时序、数据流、生命周期。

## 工作原理

1. 在对话里描述流程。例如"画出我们的报销审批流程"。
2. FlowForge 提问：谁参与？什么触发？上一次实际运行是什么样？在哪里分支？会出什么错？工作在哪里交接？
3. 逐条回读流程故事并请你确认。这是硬性关卡；没有确认就不渲染。
4. FlowForge 编译经过校验的地图并打开。

流程变化后，描述变化即可。FlowForge 会重新渲染，并与上一版本对比。

## 快速开始

把 FlowForge 安装为代理技能：

```bash
./install.sh    # macOS / Linux
./install.ps1   # Windows
```

然后告诉你的代理：

```text
Map our order-to-cash process.
```

Raven 属于代理切换器之外的手动 ZIP 安装：把 `flowforge.zip` 解压到 `~/.raven/workspace/skills`，得到 `~/.raven/workspace/skills/flowforge`。

**当前开发版本：** `v2.16.0-dev.0`。

![version badge](https://img.shields.io/badge/version-2.16.0--dev.0-0891b2?style=flat-square)

### CLI

```bash
cd flowforge
npm install
node bin/flowforge.mjs doctor
node bin/flowforge.mjs render bpmn sources/bpmn/order-to-fulfillment.bpmn.json ../deliverables/bpmn/order-to-fulfillment.html --quality showcase
node bin/flowforge.mjs compare bpmn sources/bpmn/order-to-cash.bpmn.json sources/bpmn/order-to-cash-v2.bpmn.json ../deliverables/bpmn/order-to-cash-delta.html --json
```

## 交付物

渲染好的、经过校验的产物放在 [`deliverables/`](deliverables/)。BPMN 与画布示例的源 JSON 在 `flowforge/sources/`。用下面命令重新生成全部：

```bash
node scripts/build-deliverables.mjs
```

## 不支持

- BPMN 执行或仿真引擎
- BPMN-XML 导入导出
- 可视化拖拽编辑器
- 非英语界面
- 代码库分析（那是 Archify 的职责）
- 托管服务或数据库

## 署名与许可

[MIT](LICENSE)。FlowForge 是 tt-a1i 所著 Archify（MIT）的分支，后者基于 Cocoon-AI/architecture-diagram-generator（MIT）。Refound AI 的 Lenny's Product Skills v2.0（MIT）随附于 `vendor/lenny-skills/`。见 [NOTICE.md](NOTICE.md)。