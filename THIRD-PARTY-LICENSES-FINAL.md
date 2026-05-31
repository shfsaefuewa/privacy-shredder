# Third-Party Licenses — Final

生成日期: 2026-05-31

本文件为发布包准备的最终第三方许可索引。所有运行时依赖的许可证副本已保存到 `licenses/` 目录中；下表列出每个依赖、其 SPDX 许可标识和本地文件路径。

运行时依赖（坐标） | 许可证 | 本地文件
---|---:|---
`androidx.core:core-ktx:1.12.0` | Apache-2.0 | `licenses/AndroidX-core-ktx-LICENSE.txt`
`androidx.activity:activity-ktx:1.8.2` | Apache-2.0 | `licenses/AndroidX-activity-ktx-LICENSE.txt`
`androidx.fragment:fragment-ktx:1.6.2` | Apache-2.0 | `licenses/AndroidX-fragment-ktx-LICENSE.txt`
`androidx.appcompat:appcompat:1.6.1` | Apache-2.0 | `licenses/AndroidX-appcompat-LICENSE.txt`
`androidx.constraintlayout:constraintlayout:2.1.4` | Apache-2.0 | `licenses/AndroidX-constraintlayout-LICENSE.txt`
`androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0` | Apache-2.0 | `licenses/AndroidX-lifecycle-viewmodel-ktx-LICENSE.txt`
`androidx.lifecycle:lifecycle-livedata-ktx:2.7.0` | Apache-2.0 | `licenses/AndroidX-lifecycle-livedata-ktx-LICENSE.txt`
`androidx.lifecycle:lifecycle-runtime-ktx:2.7.0` | Apache-2.0 | `licenses/AndroidX-lifecycle-runtime-ktx-LICENSE.txt`
`androidx.navigation:navigation-fragment-ktx:2.7.6` | Apache-2.0 | `licenses/AndroidX-navigation-fragment-ktx-LICENSE.txt`
`androidx.navigation:navigation-ui-ktx:2.7.6` | Apache-2.0 | `licenses/AndroidX-navigation-ui-ktx-LICENSE.txt`
`androidx.room:room-runtime:2.6.1` | Apache-2.0 | `licenses/AndroidX-room-runtime-LICENSE.txt`
`androidx.room:room-ktx:2.6.1` | Apache-2.0 | `licenses/AndroidX-room-ktx-LICENSE.txt`
`com.google.dagger:hilt-android:2.50` | Apache-2.0 | `licenses/Hilt-Android-LICENSE.txt`
`androidx.work:work-runtime-ktx:2.9.0` | Apache-2.0 | `licenses/AndroidX-work-runtime-ktx-LICENSE.txt`
`net.zetetic:android-database-sqlcipher:4.5.5` | SQLCipher 社区许可 (BSD 样式) | `licenses/SQLCIPHER_COMMUNITY_EDITION_LICENSE.txt`
`org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3` | Apache-2.0 | `licenses/KotlinxCoroutines-LICENSE.txt`
`com.google.android.material:material:1.11.0` | Apache-2.0 | `licenses/Material-LICENSE.txt`
`com.github.PhilJay:MPAndroidChart:v3.1.0` | Apache-2.0 | `licenses/MPAndroidChart-LICENSE.txt`
`com.jakewharton.timber:timber:5.0.1` | Apache-2.0 | `licenses/Timber-LICENSE.txt`
`androidx.security:security-crypto:1.1.0-alpha06` | Apache-2.0 | `licenses/AndroidX-security-crypto-LICENSE.txt`

测试/开发依赖（已保存但通常不随 APK 分发）
- `org.junit.jupiter:*` — EPL-2.0 — `licenses/EPL-2.0.txt`
- `org.mockito:*` / `org.mockito.kotlin:*` — MIT — `licenses/MIT.txt`
- `app.cash.turbine:turbine` — Apache-2.0 — `licenses/Apache-2.0.txt`

如何把许可证包含到 APK / About 页面
1. 把 `privacy-shredder/licenses/` 下需要展示的文件复制到 `app/src/main/assets/licenses/`（或在构建时把 `licenses/` 打包进资源）。
2. 在 About 页面中读取这些文件并展示（HTML 列表或单独页面）。
   - 建议把 `licenses/` 中的每个文件合并到一个 `licenses.html`，或在 About 页面中以可滚动文本/链接呈现。
3. Play Store 上的发布说明（或应用内 About）：列出关键第三方库并提供指向应用内"许可证"页面的链接。

备注：SQLCipher 的社区版要求在应用 About/文档中显示归属（见 `licenses/SQLCIPHER_COMMUNITY_EDITION_LICENSE.txt`），如果您使用商业版或特殊发行，请遵循 Zetetic 的授权指引。
