import { getSessionItem } from "@/utils/storage";
import { InternalAxiosRequestConfig } from "axios";

type Config = InternalAxiosRequestConfig<any>;

function setToken(config: Config) {
	let token = getSessionItem("token");

	// 如果找到 token，则添加到请求头中
	if (token) {
		// console.log('[HTTP] Adding token to request headers');
		config.headers.set("Authorization", `Bearer ${token}`);
	} else {
		// console.log('[HTTP] No token found in storage');
	}
}

function setContentType(config: Config) {
	config.headers.set("Content-Type", "application/json;charset=UTF-8");
	if (config.headers.needEncrypt) {
		config.headers.set("Content-Type", "text/plain");
	}
	if (config.headers.isFormData) {
		config.headers.set("Content-Type", "multipart/form-data");
		config.headers.delete("isFormData");
	}
}

export function processConfig(config: Config) {
	setToken(config);
	setContentType(config);
} 