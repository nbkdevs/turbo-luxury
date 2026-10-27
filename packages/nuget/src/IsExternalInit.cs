#if NETSTANDARD2_0
namespace System.Runtime.CompilerServices
{
    // Lets C# records and init-only setters compile when targeting netstandard2.0.
    internal static class IsExternalInit { }
}
#endif
