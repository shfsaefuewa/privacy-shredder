package com.privacy.shredder

import android.app.Activity
import android.app.Application
import android.os.Bundle
import android.view.WindowManager
import com.privacy.shredder.core.anti.AntiForensics
import com.privacy.shredder.core.database.AppDatabase
import com.privacy.shredder.core.integrity.AppIntegrityChecker
import com.privacy.shredder.core.recovery.ErrorRecovery
import com.privacy.shredder.service.ScheduleManager
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltAndroidApp
class PrivacyShredderApp : Application() {

    @Inject
    lateinit var antiForensics: AntiForensics

    @Inject
    lateinit var scheduleManager: ScheduleManager

    @Inject
    lateinit var errorRecovery: ErrorRecovery

    @Inject
    lateinit var appIntegrityChecker: AppIntegrityChecker

    @Inject
    lateinit var database: AppDatabase

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onCreate() {
        super.onCreate()
        instance = this
        initializeTimber()
        initializeErrorRecovery()
        initializeAntiForensics()
        registerSecureFlagCallback()
        restoreScheduledTasks()
        performStartupIntegrityCheck()
    }

    private fun initializeTimber() {
        if (BuildConfig.DEBUG) {
            if (antiForensics.isLogSuppressionEnabled) {
                Timber.plant(AntiForensics.SensitiveLogFilterTree())
            } else {
                Timber.plant(Timber.DebugTree())
            }
        }
    }

    private fun initializeAntiForensics() {
        if (antiForensics.isLogSuppressionEnabled && !BuildConfig.DEBUG) {
            Timber.uprootAll()
        }
    }

    private fun registerSecureFlagCallback() {
        registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
                if (antiForensics.isSecureFlagEnabled) {
                    try {
                        activity.window.setFlags(
                            WindowManager.LayoutParams.FLAG_SECURE,
                            WindowManager.LayoutParams.FLAG_SECURE
                        )
                    } catch (_: Exception) {
                    }
                }
            }

            override fun onActivityStarted(activity: Activity) {}
            override fun onActivityResumed(activity: Activity) {}
            override fun onActivityPaused(activity: Activity) {}
            override fun onActivityStopped(activity: Activity) {}
            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
            override fun onActivityDestroyed(activity: Activity) {}
        })
    }

    private fun restoreScheduledTasks() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                scheduleManager.restoreSchedules(this@PrivacyShredderApp)
            } catch (e: Exception) {
                Timber.e(e, "PrivacyShredderApp: 恢复定时清理任务失败")
            }
        }
    }

    private fun initializeErrorRecovery() {
        try {
            errorRecovery.initialize()
            Timber.d("PrivacyShredderApp: ErrorRecovery 已初始化")
        } catch (e: Exception) {
            Timber.e(e, "PrivacyShredderApp: ErrorRecovery 初始化失败")
        }
    }

    private fun performStartupIntegrityCheck() {
        applicationScope.launch {
            try {
                val result = appIntegrityChecker.performIntegrityCheck(database)
                if (!result.overallOk) {
                    Timber.w("PrivacyShredderApp: 完整性检查未通过，触发自修复\n%s", result.formatReport())
                    errorRecovery.selfRepair(database)
                }
            } catch (e: Exception) {
                Timber.e(e, "PrivacyShredderApp: 启动完整性检查失败")
            }
        }
    }

    companion object {
        lateinit var instance: PrivacyShredderApp
            private set
    }
}
