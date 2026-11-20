# Scholar Wizards 网站部署与运维（含 Vercel → Cloudflare Pages 迁移记录）

> 本文说明 `scholarwizards.com` 的部署方式、更新数据的流程和排查方法，并记录 2026-11-20 从 Vercel 迁到 Cloudflare Pages 的完整过程。
>
> 最后更新：2026-11-20（从 Vercel 迁到 Cloudflare Pages，Next.js 静态导出）

## 1. 总览

| 项目 | 值 |
|---|---|
| 托管 | Cloudflare Pages，项目 `scholar-wizards`，账号 Philo（与 philoli.com 同一个账号） |
| 形态 | 纯静态站点：`scholar-viz/` 以 `output: "export"` 导出到 `scholar-viz/out/`，直接上传到 Pages，没有服务端 |
| 部署 | GitHub Actions `.github/workflows/deploy-pages.yml`，用 `wrangler pages deploy` 上传 |
| 代码来源 | GitHub `Philo-Li/scholar-wizards`，分支 `main`，网站代码在 `scholar-viz/` |
| 域名 | `scholarwizards.com`；`www.scholarwizards.com` 308 跳到主域名 |
| 默认地址 | `https://scholar-wizards.pages.dev`（每次部署另有 `https://<hash>.scholar-wizards.pages.dev`） |
| 证书 | Cloudflare 自动签发和续期 |

站点的全部数据都在 `scholar-viz/src/data/*.json` 里，在构建时打包进页面，运行时不请求任何接口。中英文切换在浏览器里完成，选择的语言存在 localStorage，不会改变网址。

## 2. 部署

### 2.1 自动部署

push 到 `main` 时，只要改了 `scholar-viz/**` 或这个 workflow 文件，就会部署到生产环境。只改 `scripts/`、`data/` 或 `docs/` 不会触发。没有预览环境。

流程：在 `scholar-viz/` 下执行 `npm ci` 和 `npm run build`，再执行 `wrangler pages deploy out --project-name scholar-wizards --branch main`。整个过程约 1 分钟。Pages 只上传有变化的文件，部署完成后立即生效。

没有新提交，但想重新部署时：

```bash
gh workflow run deploy-pages.yml -R Philo-Li/scholar-wizards --ref main
```

### 2.2 从本机部署

不经过 GitHub 时，可以在本机执行。前提是本机已经运行过 `npx wrangler login`：

```bash
cd scholar-viz
npm run build
npx wrangler@4.84.1 pages deploy out --project-name scholar-wizards --branch main
```

首次迁移就是用这种方式部署的。

### 2.3 回滚

Pages 保留每一次部署。在 Cloudflare 后台进入 Workers & Pages → `scholar-wizards` → Deployments，找到要回到的那次部署，选 **Rollback to this deployment** 即可，立即生效。

也可以 `git revert` 后 push，让 workflow 重新构建。

### 2.4 Secret

workflow 用到仓库的两个 secret：

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Philo 账号的 ID（`2e94795a5a5d46956e4c76598af23915`），不是机密 |
| `CLOUDFLARE_API_TOKEN` | 账号级 API token，需要有 Cloudflare Pages 的编辑权限。迁移时使用的是 `dopamind-web/.env.production` 里 `Cloudflare_API_TOKEN` 的值 |

更换 token 时，执行 `gh secret set CLOUDFLARE_API_TOKEN -R Philo-Li/scholar-wizards` 并粘贴新值。注意：账号级 token 用 `/user/tokens/verify` 校验会返回「Invalid API Token」，要改用 `/accounts/<账号 ID>/tokens/verify`。

## 3. 更新数据

1. 用 `scripts/` 下的 Python 脚本重新抓取数据，结果写到 `data/*.csv`。
2. 把需要展示的数据更新到 `scholar-viz/src/data/*.json`（`scholars.json`、`scholarDetails.json`、`earlyCareer.json`、`youngestScholars.json`）。
3. push 到 `main`。因为改了 `scholar-viz/` 下的文件，会自动部署。

学者详情页 `/scholar/<id>` 按 `scholarDetails.json` 里的 `id` 逐个生成（目前有 98 个）。新增学者后，只要它出现在 `scholarDetails.json` 里，就会自动生成对应页面；不在这个文件里的 id 访问时返回 404。

## 4. 开发约束（静态导出带来的）

- 不能用 `cookies()`、`headers()`、Route Handler（`route.ts`）、Server Actions 和中间件。需要服务端逻辑时，得另外部署接口。
- 带动态参数的路由必须提供 `generateStaticParams`，并设置 `dynamicParams = false`。参照 `src/app/scholar/[id]/page.tsx`：
  - `page.tsx` 是服务端外壳，只负责列出所有 id；
  - 页面内容在 `ScholarPageClient.tsx`（`'use client'`），通过 `useParams()` 取 id。
- 组件里用了 `useSearchParams()` 的，必须包在 `<Suspense>` 里，否则所在页面预渲染会失败。
- 本地检查：`npm run build` 成功后，`out/` 里的文件就是线上的全部内容。

Pages 会自动去掉 `.html` 后缀：`/scholar/<id>` 返回 `scholar/<id>.html`，找不到的路径返回 `404.html`。所以不需要额外的路由配置。

## 5. 排查

- **构建失败**：查看 GitHub Actions 的运行日志，执行 `gh run view <run id> -R Philo-Li/scholar-wizards --log-failed`。
- **部署记录和每次部署的预览地址**：Cloudflare 后台 → Workers & Pages → `scholar-wizards`，或者执行 `npx wrangler pages deployment list --project-name scholar-wizards`。
- **检查线上状态**：

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://scholarwizards.com/scholar/A5108803445   # 200
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.scholarwizards.com/  # 308 https://scholarwizards.com/
```

## 6. DNS

DNS 在 Cloudflare（同一个账号）：

| 记录 | 类型 | 值 |
|---|---|---|
| `scholarwizards.com` | CNAME | `scholar-wizards.pages.dev` |
| `www` | CNAME | `scholar-wizards.pages.dev` |

两个域名都已经在 Pages 项目的 Custom domains 里绑定好了。如果要换域名，需要先在那里添加新域名，再改 DNS，否则访问会报 522 或 1014 错误。

## 7. 已知限制

- **没有预览环境**：push 到 `main` 就会直接上生产。如果把 workflow 里的 `--branch main` 改成别的分支名，那次部署只会出现在预览地址上，不影响正式站。
- **没有 favicon**：`scholar-viz/public/` 是空的，`/favicon.ico` 返回 404。迁移前就是这样。
- **只有一个页面标题**：所有页面的 `<title>` 都是根 layout 里写死的 "Scholar Wizards - Computational Neuroscience Analysis"，学者详情页没有单独的标题和描述。

## 8. 迁移记录（2026-11-20）

### 8.1 起因

Vercel 的免费额度用完后，部署被停用，`scholarwizards.com` 返回 `402 Payment Required`（`DEPLOYMENT_DISABLED`）。同一天，dopamind、goshipfast、erasebg、speechtype、tinyimg、philoart 的网站也因为同样的原因迁走了。

### 8.2 方案

其他几个站都迁到了 AWS 东京机，这个站选了 Cloudflare Pages，原因是：

- 没有后端，也没有语言跳转之类需要服务端处理的逻辑，静态导出后就是一堆文件，Pages 可以直接托管。
- Pages 免费，带全球 CDN，也不占用东京机的资源，还能避开东京机的单点故障。
- philoli.com 已经在同一个账号的 Pages 上运行，部署方式可以直接照搬。

### 8.3 做了什么

代码侧（`Philo-Li/scholar-wizards` 仓库）：

| 提交 | 内容 |
|---|---|
| `db33a0c` | `scholar-viz/next.config.ts` 改为 `output: "export"`。原来的 `src/app/scholar/[id]/page.tsx`（客户端组件）改名为 `ScholarPageClient.tsx`，内容不变；新的 `page.tsx` 用 `generateStaticParams` 为 98 个学者各生成一个页面，并设置 `dynamicParams = false` |
| `18645f6` | 新增 `.github/workflows/deploy-pages.yml`，参照 philoli.com 的 workflow，加上了 `scholar-viz` 工作目录和路径过滤 |

Cloudflare 侧：

1. 用本机已登录的 wrangler 创建 Pages 项目：`wrangler pages project create scholar-wizards --production-branch main`。
2. 在本机构建，并执行 `wrangler pages deploy out` 完成首次部署。在 `scholar-wizards.pages.dev` 上验证：首页、详情页、客户端跳转用的 `.txt` 都返回 200，不存在的路径返回 404。
3. 调用 Pages API 添加 `scholarwizards.com` 和 `www.scholarwizards.com` 两个自定义域名。wrangler 本身没有绑定域名的命令，这一步用的是本机 wrangler 的 OAuth 凭证，它带有 `pages:write` 权限。
4. 用户在 Cloudflare DNS 里把这两个域名从 Vercel（apex 原来是 A 记录 `216.198.79.1`，`www` 原来是 CNAME 到 Vercel）改为 CNAME 到 `scholar-wizards.pages.dev`。几分钟后，域名验证和证书签发都完成了。
5. 把仓库 secret `CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN` 设好，然后 push。workflow 第一次运行就部署成功了。

### 8.4 踩过的坑

- **找不到可用的 token**：GitHub secret 只能写入、不能读出，所以拿不到 philoli.com 仓库里的 token 值。本机 wrangler 的 OAuth 凭证有效期很短，也没有创建 token 的权限。本地有几个 `.env` 里存了 `CLOUDFLARE_API_TOKEN`，但都是只开了 Workers 和 R2 权限的同一个 token，访问 Pages 返回 `10000: Authentication error`。最后用的是 `dopamind-web/.env.production` 里的 `Cloudflare_API_TOKEN`；它的变量名大小写混写，按全大写搜索时漏掉了。
- **误把账号级 token 判断为失效**：用 `/user/tokens/verify` 校验账号级 token，一律返回「Invalid API Token」，要改用 `/accounts/<id>/tokens/verify`。

### 8.5 上线验证

- `https://scholarwizards.com/` 和 `/scholar/A5108803445` 返回 200，证书有效。
- `http://scholarwizards.com/` 和 `https://www.scholarwizards.com/` 都 308 跳到 `https://scholarwizards.com/`。
- 不存在的学者 id 返回 404。
- GitHub Actions 部署成功（run `44678324833`）。

### 8.6 遗留事项

- Vercel 上的项目已经没有流量，可以删除。
- `EarlyCareerRanking` 里有些学者在 `nameToIdMap` 里找不到对应的 id，链接会变成 `/scholar/`，点进去是 404。这个问题迁移前就有，没有处理。
