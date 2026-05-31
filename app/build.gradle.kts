plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.dagger.hilt.android")
    kotlin("kapt")
}

android {
    namespace = "com.privacy.shredder"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.privacy.shredder"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        kapt {
            arguments {
                arg("room.schemaLocation", "$projectDir/schemas")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
}

val libs = mapOf(
    "androidxCoreKtx" to "1.12.0",
    "androidxActivityKtx" to "1.8.2",
    "androidxFragmentKtx" to "1.6.2",
    "androidxAppcompat" to "1.6.1",
    "androidxConstraintLayout" to "2.1.4",
    "lifecycleViewmodelKtx" to "2.7.0",
    "lifecycleLivedataKtx" to "2.7.0",
    "lifecycleRuntimeKtx" to "2.7.0",
    "navigationFragmentKtx" to "2.7.6",
    "navigationUiKtx" to "2.7.6",
    "roomRuntime" to "2.6.1",
    "roomKtx" to "2.6.1",
    "hiltAndroid" to "2.50",
    "workRuntimeKtx" to "2.9.0",
    "sqlcipherAndroid" to "4.5.5",
    "coroutinesAndroid" to "1.7.3",
    "materialDesign" to "1.11.0",
    "mpandroidchart" to "3.1.0",
    "timber" to "5.0.1",
    "securityCrypto" to "1.1.0-alpha06"
)

dependencies {
    implementation("androidx.core:core-ktx:${libs["androidxCoreKtx"]}")
    implementation("androidx.activity:activity-ktx:${libs["androidxActivityKtx"]}")
    implementation("androidx.fragment:fragment-ktx:${libs["androidxFragmentKtx"]}")
    implementation("androidx.appcompat:appcompat:${libs["androidxAppcompat"]}")
    implementation("androidx.constraintlayout:constraintlayout:${libs["androidxConstraintLayout"]}")

    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:${libs["lifecycleViewmodelKtx"]}")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:${libs["lifecycleLivedataKtx"]}")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:${libs["lifecycleRuntimeKtx"]}")

    implementation("androidx.navigation:navigation-fragment-ktx:${libs["navigationFragmentKtx"]}")
    implementation("androidx.navigation:navigation-ui-ktx:${libs["navigationUiKtx"]}")

    implementation("androidx.room:room-runtime:${libs["roomRuntime"]}")
    implementation("androidx.room:room-ktx:${libs["roomKtx"]}")
    kapt("androidx.room:room-compiler:${libs["roomRuntime"]}")

    implementation("com.google.dagger:hilt-android:${libs["hiltAndroid"]}")
    kapt("com.google.dagger:hilt-compiler:${libs["hiltAndroid"]}")

    implementation("androidx.work:work-runtime-ktx:${libs["workRuntimeKtx"]}")

    implementation("net.zetetic:android-database-sqlcipher:${libs["sqlcipherAndroid"]}")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:${libs["coroutinesAndroid"]}")

    implementation("com.google.android.material:material:${libs["materialDesign"]}")

    implementation("com.github.PhilJay:MPAndroidChart:v${libs["mpandroidchart"]}")

    implementation("com.jakewharton.timber:timber:${libs["timber"]}")

    implementation("androidx.security:security-crypto:${libs["securityCrypto"]}")

    testImplementation("org.junit.jupiter:junit-jupiter-api:5.10.1")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.10.1")
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.10.1")

    testImplementation("org.mockito:mockito-core:5.8.0")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.2.1")

    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")

    testImplementation("app.cash.turbine:turbine:1.0.0")

    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

kapt {
    correctErrorTypes = true
}

val copyLicensesToAssets by tasks.registering(org.gradle.api.tasks.Copy::class) {
    from(rootProject.file("licenses"))
    into(file("src/main/assets/licenses"))
}

val generateLicensesIndex by tasks.registering {
    dependsOn(copyLicensesToAssets)
    doLast {
        val assetsDir = file("src/main/assets/licenses")
        assetsDir.mkdirs()
        val indexFile = assetsDir.resolve("licenses.html")
        val files = assetsDir.listFiles()?.filter { it.isFile }?.sortedBy { it.name } ?: emptyList()
        val sb = StringBuilder()
        sb.append("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Licenses</title></head><body style=\"font-family: sans-serif; padding:16px;\">")
        sb.append("<h1>Third-Party Licenses</h1>")
        files.forEach { f ->
            val name = f.name
            val content = f.readText(Charsets.UTF_8).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
            sb.append("<h2>").append(name).append("</h2>")
            sb.append("<pre style=\"white-space:pre-wrap; background:#f5f5f5; padding:12px; border-radius:6px;\">")
            sb.append(content)
            sb.append("</pre>")
        }
        sb.append("</body></html>")
        indexFile.writeText(sb.toString(), Charsets.UTF_8)
    }
}

tasks.named("preBuild") {
    dependsOn(generateLicensesIndex)
}
