# ========================================
# ProGuard Rules for PrivacyShredder
# ========================================

# ---- Kotlin ----
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keep class kotlin.Metadata { *; }
-keep class kotlin.** { *; }
-dontwarn kotlin.**
-keep class kotlinx.coroutines.** { *; }
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# ---- Kotlin data classes ----
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keepclassmembers class com.privacy.shredder.** { <fields>; }
-keepclassmembers class com.privacy.shredder.core.database.entity.** {
    <fields>;
    <init>(...);
}
-keep class com.privacy.shredder.core.model.** { *; }

# ---- Parcelable ----
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# ---- Room Database ----
-keep class * extends androidx.room.RoomDatabase { *; }
-keep @androidx.room.Entity class * { *; }
-keepclassmembers class * extends androidx.room.** { *; }
-dontwarn androidx.room.paging.**
-keep class com.privacy.shredder.core.database.entity.** { *; }
-keep class com.privacy.shredder.core.database.dao.** { *; }

# ---- Hilt / Dagger ----
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
-keep class * extends dagger.hilt.android.internal.managers.ViewComponentManager$FragmentContextWrapper { *; }
-dontwarn dagger.**
-keep class com.privacy.shredder.PrivacyShredderApp { *; }
-keep class com.privacy.shredder.core.di.** { *; }

# ---- Navigation ----
-keep class * extends androidx.navigation.Navigator
-keep class * extends androidx.navigation.NavArgs { *; }

# ---- SQLCipher ----
-keep class net.sqlcipher.** { *; }
-keep class net.sqlcipher.database.** { *; }
-keep class org.sqlite.** { *; }
-dontwarn net.sqlcipher.**

# ---- EncryptedSharedPreferences ----
-keep class androidx.security.crypto.** { *; }
-dontwarn androidx.security.crypto.**

# ---- Gson ----
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-keep class * extends com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-dontwarn com.google.gson.**

# ---- MPAndroidChart ----
-keep class com.github.mikephil.charting.** { *; }

# ---- Timber ----
-assumenosideeffects class timber.log.Timber {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
}
-dontwarn org.jetbrains.annotations.**

# ---- Log ----
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
}

# ---- Coroutines ----
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# ---- ViewBinding ----
-keep class * implements androidx.viewbinding.ViewBinding { *; }

# ---- WorkManager ----
-keep class * extends androidx.work.Worker { *; }

# ---- Material Components ----
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# ---- Custom Views ----
-keep class com.privacy.shredder.feature.dashboard.ScoreCircleView { *; }
-keep class com.privacy.shredder.adapter.** { *; }

# ---- Accessibility Service ----
-keep class com.privacy.shredder.service.AccessibilityCleanService { *; }

# ---- Notification Listener Service ----
-keep class com.privacy.shredder.service.ClipboardMonitorService { *; }

# ---- Anti-Forensics ----
-keep class com.privacy.shredder.core.anti.** { *; }
-keep class com.privacy.shredder.core.anti.AntiForensics { *; }
-keep class com.privacy.shredder.core.anti.AntiForensics$SensitiveLogFilterTree { *; }
-keep class com.privacy.shredder.core.anti.DisguiseProfile { *; }
-keep class com.privacy.shredder.feature.settings.DisguiseConfigActivity { *; }

# ---- R8 ----
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-repackageclasses com.privacy.shredder.obfuscated
