import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"

@Injectable({
    providedIn: "root"
})
export class TokenInterceptor implements HttpInterceptor {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("idToken")
        if(idToken == null) return next.handle(req)
        return next.handle(req.clone({
            headers: req.headers.set("Authorization", `Bearer ${idToken}`)
        }))
    }
}
