# Third-Party Licenses

此文件汇总应用中运行时依赖的许可证概览、来源与注意事项。仅列出 app 模块中 runtime 和重要库；测试范围依赖已标注但通常不随 APK 分发。

## 运行时依赖（主要）

- `androidx.core:core-ktx` / `androidx.*` — License: Apache-2.0
  - 来源: AndroidX / Maven Central

- `com.google.dagger:hilt-android` / `com.google.dagger:hilt-compiler` — License: Apache-2.0
  - 来源: https://github.com/google/dagger/blob/master/LICENSE.txt

- `org.jetbrains.kotlinx:kotlinx-coroutines-android` — License: Apache-2.0
  - 来源: https://github.com/Kotlin/kotlinx.coroutines/blob/master/LICENSE.txt

- `com.google.android.material:material` — License: Apache-2.0
  - 来源: https://github.com/material-components/material-components-android/blob/master/LICENSE

- `com.github.PhilJay:MPAndroidChart:v3.1.0` — License: Apache-2.0 (请核实具体 tag/发布)
  - 来源: https://github.com/PhilJay/MPAndroidChart/blob/master/LICENSE
  - 注意: 部分 API/Maven 元数据可能返回 NOASSERTION，建议在发行时确认所用版本的 LICENSE 文本

- `com.jakewharton.timber:timber` — License: Apache-2.0
  - 来源: https://github.com/JakeWharton/timber/blob/trunk/LICENSE.txt

- `net.zetetic:android-database-sqlcipher` — License: SQLCipher 特定许可（见 SQLCIPHER_LICENSE）；上游核心为 BSD-3-Clause
  - 来源: https://github.com/sqlcipher/android-database-sqlcipher/blob/master/SQLCIPHER_LICENSE
  - 注意: 请核实包装器的 redistrib 要求与 NOTICE 条款，确保在分发和二进制中包含必要声明

- `androidx.room:room-runtime` — License: Apache-2.0
  - 来源: AndroidX / Maven Central

- `androidx.security:security-crypto` — License: Apache-2.0
  - 来源: AndroidX / Maven Central

## 测试/开发依赖（不随 APK 分发）

- `org.junit.jupiter:junit-jupiter-*` — License: EPL-2.0 (测试用)
  - 来源: https://github.com/junit-team/junit-framework/blob/main/LICENSE.md

- `org.mockito:mockito-core`, `org.mockito.kotlin:mockito-kotlin` — License: MIT (测试用)
  - 来源: mockito 项目 LICENSE / 仓库

- `app.cash.turbine:turbine` — License: Apache-2.0 (测试用)
  - 来源: https://github.com/cashapp/turbine/blob/trunk/LICENSE.txt

## 建议和下一步操作

1. 为每个运行时依赖生成单独节，包含：依赖坐标、SPDX 标识、LICENSE 文本或指向 LICENSE 文件的直接链接、以及任何 NOTICE/归属要求。把这些并入 `assets/` 或 `ABOUT` 页面以满足发布合规性要求。
2. 特别核实 `net.zetetic:android-database-sqlcipher` 的 `SQLCIPHER_LICENSE` 要求；若需要，将 SQLCipher 的 NOTICE/归属加入发行说明或 About 页面。
3. 对于 GitHub API 返回 `NOASSERTION` 或不明确的条目（例如部分 MPAndroidChart 版本），直接下载所用 tag/release 的 LICENSE 文件，或使用 Maven Central 上的 POM 中 `<licenses>` 条目作为来源。
4. 生成最终的 `THIRD-PARTY-LICENSES.md` 完整版本并在 Play Store 发布页面/应用 About 页面中说明已包含第三方许可证列表。

---
_自动生成（初稿）。如需我将所有 LICENSE 原文抓取并追加到仓库中，或把此清单嵌入应用 About 页面，请回复"添加原文"或"集成到 About"。_

## 本地许可证副本

已抓取并保存到仓库 `licenses/` 目录的许可证原文：

- `licenses/SQLCIPHER_COMMUNITY_EDITION_LICENSE.txt` — SQLCipher 社区版 BSD 风格许可（来源: https://www.zetetic.net/sqlcipher/license/SQLCIPHER_COMMUNITY_EDITION_LICENSE.txt）
- `licenses/MIT.txt` — MIT 许可（通用模板，来源示例: https://choosealicense.com/licenses/mit/）
- `licenses/BSD-3-Clause.txt` — BSD-3-Clause（SPDX 文本）

建议：在发布前把 `licenses/` 中与运行时依赖相关的许可证副本包含到发行包（或在 About 页面明示链接与归属），并特别确认 `SQLCipher` 是否要求在应用 About/文档中展示特定归属或 NOTICE。

已补充的其它许可证原文：

- `licenses/Apache-2.0.txt` — Apache License 2.0（适用于大多数 AndroidX、Google 库、Timber、MPAndroidChart 等）
- `licenses/EPL-2.0.txt` — Eclipse Public License 2.0（适用于部分 JUnit 组件）

- `licenses/MPAndroidChart-LICENSE.txt` — `com.github.PhilJay:MPAndroidChart:v3.1.0`（映射，指向 Apache-2.0）
- `licenses/Timber-LICENSE.txt` — `com.jakewharton.timber:timber:5.0.1`（映射，指向 Apache-2.0）
- `licenses/Dagger-LICENSE.txt` — `com.google.dagger:hilt-android:2.50`（映射，指向 Apache-2.0）
- `licenses/Material-LICENSE.txt` — `com.google.android.material:material:1.11.0`（映射，指向 Apache-2.0）
- `licenses/KotlinxCoroutines-LICENSE.txt` — `org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3`（映射，指向 Apache-2.0）

其它已生成的映射文件（AndroidX 运行时依赖）：

- `licenses/AndroidX-core-ktx-LICENSE.txt` — `androidx.core:core-ktx:1.12.0`
- `licenses/AndroidX-appcompat-LICENSE.txt` — `androidx.appcompat:appcompat:1.6.1`
- `licenses/AndroidX-constraintlayout-LICENSE.txt` — `androidx.constraintlayout:constraintlayout:2.1.4`
- `licenses/AndroidX-lifecycle-viewmodel-ktx-LICENSE.txt` — `androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0`
- `licenses/AndroidX-lifecycle-livedata-ktx-LICENSE.txt` — `androidx.lifecycle:lifecycle-livedata-ktx:2.7.0`
- `licenses/AndroidX-lifecycle-runtime-ktx-LICENSE.txt` — `androidx.lifecycle:lifecycle-runtime-ktx:2.7.0`
- `licenses/AndroidX-navigation-fragment-ktx-LICENSE.txt` — `androidx.navigation:navigation-fragment-ktx:2.7.6`
- `licenses/AndroidX-navigation-ui-ktx-LICENSE.txt` — `androidx.navigation:navigation-ui-ktx:2.7.6`
- `licenses/AndroidX-room-runtime-LICENSE.txt` — `androidx.room:room-runtime:2.6.1`
- `licenses/AndroidX-work-runtime-ktx-LICENSE.txt` — `androidx.work:work-runtime-ktx:2.9.0`
- `licenses/AndroidX-security-crypto-LICENSE.txt` — `androidx.security:security-crypto:1.1.0-alpha06`

- `licenses/AndroidX-activity-ktx-LICENSE.txt` — `androidx.activity:activity-ktx:1.8.2`
- `licenses/AndroidX-fragment-ktx-LICENSE.txt` — `androidx.fragment:fragment-ktx:1.6.2`
- `licenses/AndroidX-room-ktx-LICENSE.txt` — `androidx.room:room-ktx:2.6.1`
- `licenses/Hilt-Android-LICENSE.txt` — `com.google.dagger:hilt-android:2.50` (Hilt 映射)

下一步建议：对 `app/build.gradle.kts` 中确切版本逐个验证并把对应 LICENSE 副本（或链接）追加到 `licenses/` 中，然后生成最终版 `THIRD-PARTY-LICENSES.md` 并将其嵌入应用 About 或发布页面。
